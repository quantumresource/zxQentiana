function Loewenzahn(name, vis_options, estimation_method) {
    /*
        Parameters
    */
    this.nr_items = 100;
    // log spaced volume scaling factor
    this.global_v = local_logspace(-2, 2, this.nr_items);
    // scaling factor space
    this.global_s = local_linspace(0.1, 2, this.nr_items);
    //name of the div
    this.plot_name = name;
    //
    this.options = vis_options;
    //
    this.estimation_method = estimation_method;
    //
    var ref = this;

    this.xScale_local = d3.scaleLinear()
        .domain([ref.global_s[0], ref.global_s[ref.global_s.length - 1]])
        .range([0, ref.global_s.length * ref.options.itemSize]);

    this.xAxis = d3.axisBottom()
        .scale(ref.xScale_local);

    this.yScale_local = d3.scaleLog()
        .domain([ref.global_v[0], ref.global_v[ref.global_v.length - 1]])
        .range([ref.global_v.length * ref.options.itemSize, 0]);

    this.yAxis = d3.axisLeft()
        .scale(ref.yScale_local)
        .ticks(6, function(d) {
            return 10 + formatPower(Math.round(Math.log(d) / Math.LN10));
        });

    this.explanation = "Given a fixed number of physical qubits, what is the total success probability? The higher the probability the lighter color.";
    create_description(this.plot_name.replace(".", ""), this.explanation);

    this.parameters = {};
    this.parameters["bool_update_plot"] = false;
    this.parameters["total_num_physical_qubits"] = 500;
    for (key in this.parameters) {
        create_parameter(this.plot_name.replace(".", ""), key, this.parameters[key]);
    }
}

Loewenzahn.prototype.get_max_dist_from_qubits = function(logical_qubits, total_physical_qubits) {
    // Calculates the maximum distance given a fixed number of physical qubits

    if (logical_qubits > total_physical_qubits) {
        return -1;
    }
    var ret = Math.floor(Math.sqrt(total_physical_qubits / logical_qubits));
    if (ret <= 2)
        return 1;

    return ret;
}

Loewenzahn.prototype.total_err = function(indiv_err, volume) {
    // given a per step error rate calculate the total error of the computation
    return Math.pow(1 - indiv_err, volume);
}

// TODO INPUT IS CHANGED FROM total_failure_rate TO total_num_physical_qubits
Loewenzahn.prototype.gen_data = function(total_failure_rate, experiment) {

    var space_min   = experiment.footprint;
    var volume_min  = experiment.volume;
    var p_err = experiment.physical_error_rate;

    /*
        Collect from the field
    */
    for (key in this.parameters) {
        this.parameters[key] = document.getElementById(this.plot_name.replace(".", "") + "_" + key).value;
    }

    var total_num_physical_qubits = this.parameters["total_num_physical_qubits"];

    var data = new Array();
    var dist = 0;
    var space_param = 0;
    var volume_param = 0;
    var P_out = 0;

    for (var i = 0; i < this.global_v.length; i++) {
        for (var j = 0; j < this.global_s.length; j++) {
            space_param = Math.ceil(space_min * this.global_s[j]);
            volume_param = Math.ceil(volume_min * this.global_v[i]);
            dist = this.get_max_dist_from_qubits(space_param, total_num_physical_qubits);
            var indiv_err = austin_p_logical(p_err, dist);
            P_out = this.total_err(indiv_err, volume_param);

            //maybe change names for this data array because different meaning of output
            data.push({
                x: this.global_s[j],
                y: this.global_v[i],
                dist: dist,
                indiv_error: indiv_err,
                total_volume: volume_param,
                qubits_used: number_of_physical_qubits(dist, space_param),
                total_error: P_out
            })
        }
    }

    return data;
}

Loewenzahn.prototype.color_interpretation = function(d) {
    return "rgb(" + to_rgb(d.total_error) + "," + to_rgb(d.total_error) + "," + to_rgb(d.total_error) + ")";
}

Loewenzahn.prototype.init_visualisation = function() {
    var ref = this;
    var svg = d3.select(ref.plot_name)
        .append("svg")
        .attr("width", ref.options.width + ref.options.margin.left + ref.options.margin.right)
        .attr("height", ref.options.height + ref.options.margin.top + ref.options.margin.bottom)
        .append("g")
        .attr("id", "plotsvg" + ref.plot_name.replace(".", ""))
        .attr("transform", "translate(" + ref.options.margin.left + "," + ref.options.margin.top + ")");

    var data = this.gen_data(total_failure_rate, experiment);

    d3.select('#plotsvg' + ref.plot_name.replace(".", "")).selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', ref.options.cellSize)
        .attr('height', ref.options.cellSize)
        .attr('y', function(d) {
            return ref.yScale_local(d.y);
        })
        .attr('x', function(d) {
            return ref.xScale_local(d.x);
        })
        .attr('fill', function(d) {
            return ref.color_interpretation(d);
        })
        .on('mouseover', function(data, param2) {
            var output = document.getElementById("console");
            // clean console
            output.style.color = "black";
            var content = "";
            content += "Distance at point (" + data.x + ", " + data.y + "): <br>" + data.dist + " <br>";
            content += "error rate in unit cell: " + data.indiv_error + " with a total volume of " + data.total_volume + "<br>";
            content += "Total success probability: " + data.total_error + "<br>";
            mouseOver(content);
        })
        .on('mousemove', mouseMove)
        .on('mouseout', mouseOut);


    svg.append("g")
        .attr("class", "y axis")
        .call(ref.yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (ref.global_v.length + 2) * ref.options.itemSize + ")")
        .call(ref.xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start");


    // draw lines
    xarray2 = [ref.global_v[0], ref.global_v[ref.global_v.length - 1]]
    var line2 = d3.line()
        .x(function(d, i) {
            return ref.xScale_local(1);
        })
        .y(function(d, i) {
            return ref.yScale_local(d);
        });

    xarray3 = [ref.global_s[0], ref.global_s[ref.global_s.length - 1]]
    var line3 = d3.line()
        .x(function(d, i) {
            return ref.xScale_local(d);
        })
        .y(function(d, i) {
            return ref.yScale_local(1);
        });

    svg.append("svg:path").attr("d", line2(xarray2));
    svg.append("svg:path").attr("d", line3(xarray3));

    // now add titles to the axes
    var movey = (ref.global_v.length + 1) * ref.options.itemSize;
    var movex = (ref.global_s.length + 1) * ref.options.itemSize;

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (-ref.options.margin.left / 2) + "," + (movex / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .text("Volume Factor");

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (movex / 2) + "," + (movey + (2* ref.options.margin.bottom)) + ")") // centre below axis
        .text("Space Factor");
}

Loewenzahn.prototype.update_data = function() {
    var ref = this;

    for (key in this.parameters) {
        if (!is_internal_parameter(key)) {
            this.parameters[key] = read_parameter(this.plot_name.replace(".", ""), key);
        }
    }

    if (this.parameters["bool_update_plot"]) {
        var data = this.gen_data(total_failure_rate, experiment);
        d3.select(this.plot_name).selectAll("rect")
            .data(data)
            .transition().duration(1000)
            .style("fill", function(d) {
                return ref.color_interpretation(d);
            });
    }
}