function Type2Plot(data_obj, name, vis_options) {
    // /* 
    //     Parameters
    // */
    this.plot_name = name;
    //
    this.options = Object.create(vis_options);
    // 
    this.data_obj = data_obj;
    //
    update_vis_dimensions(this.options, this.plot_name, this.data_obj.nr_items);
    //
    var ref = this;

    this.console_text = "";

    this.xScale = d3.scaleLinear()
        .domain([ref.data_obj.x_axis_values[0], ref.data_obj.x_axis_values[ref.data_obj.x_axis_values.length - 1]])
        .range([0, ref.data_obj.x_axis_values.length * ref.options.itemSize]);

    this.xAxis = d3.axisBottom()
        .scale(ref.xScale);

    this.yScale = d3.scaleLog()
        .domain([ref.data_obj.y_axis[0], ref.data_obj.y_axis[ref.data_obj.y_axis.length - 1]])
        .range([ref.data_obj.y_axis.length * ref.options.itemSize, 0]);

    this.yAxis = d3.axisLeft()
        .scale(ref.yScale)
        .ticks(6, function(d) {
            return 10 + formatPower(Math.round(Math.log(d) / Math.LN10));
        });

    /**
     * HTML related
     */
    create_description(this.plot_name.replace(".", ""), this.data_obj);
    var ppp = this.data_obj.get_default_parameters()
    for (key in ppp) {
        create_parameter(this.plot_name.replace(".", ""), key, ppp[key]);
    }
}

Type2Plot.prototype.draw_vertical_line = function(y_min, y_max, x_pos, type = "vertical_line") {
    var ref = this;
    var data = [{
        x: x_pos,
        y: y_min
    }, {
        x: x_pos,
        y: y_max
    }]
    var line = d3.line()
        .x(function(d, i) {
            return ref.xScale(d.x);
        })
        .y(function(d, i) {
            return ref.yScale(d.y);
        });

    d3.select("#plotsvg" + ref.plot_name.replace(".", "")).append("svg:path").attr("class", type).attr("d", line(data));
}

// 
Type2Plot.prototype.draw_line_plot = function(data) {
    var slices = new Array(new Array());
    var slice_index = 0;

    for (var i = 0; i < data.length; i++) {
        // if (data[i].use_data_bus) {
        if(true){
            /*Always plot data bus*/
            if (slices[slice_index].length == 0) {
                slices[slice_index].push(i);
            }
        } else {
            if (slices[slice_index].length == 1) {
                slices[slice_index].push(i);

                slice_index++;
                slices[slice_index] = new Array();
            }
        }
    }
    if (slices[slice_index].length == 0) {
        //an unfinished slice means that only false for use_data_bus to the end of the data
        slices.pop();
    } else if (slices[slice_index].length == 1) {
        // until the end there are only use_data_bus elements
        slices[slice_index].push(data.length);
    }

    var ref = this;
    var line1 = d3.line()
        .x(function(d, i) {
            return ref.xScale(d["x"]);
        })
        .y(function(d, i) {
            // return d.use_data_bus ? ref.yScale(d.number_of_physical_qubits) : 0;});
            // return (d.use_data_bus ? ref.yScale(d.number_of_physical_qubits) : ref.yScale(ref.y_axis[0]));});
            return ref.yScale(d["number_of_physical_qubits"]);
        });

    var line2 = d3.line()
        .x(function(d, i) {
            return ref.xScale(d["x"]);
        })
        .y(function(d, i) {
            return ref.yScale(d["original_number_of_physical_qubits"]);
        });

    for (var slice_index = 0; slice_index < slices.length; slice_index++) {
        console.log("use data bus between indices: " + slices[slice_index]);
        var data_slice = data.slice(slices[slice_index][0], slices[slice_index][1]);

        //the lines with data bus advantage
        d3.select("#plotsvg" + ref.plot_name.replace(".", "")).append("svg:path").attr("class", "line_plot").attr("d", line1(data_slice));
    }

    // the line without data bus
    d3.select("#plotsvg" + ref.plot_name.replace(".", "")).append("svg:path").attr("class", "line_plot_red").attr("d", line2(data));
    // d3.select("#plotsvg" + ref.plot_name.replace(".", "")).append("svg:path").attr("class","line_plot").attr("d", line1(data));
}

Type2Plot.prototype.init_visualisation = function(parent_holder) {

    create_divs_for_plot(parent_holder, this.plot_name, "400px", "400px");

    var ref = this;

    var svg = d3.select(this.plot_name)
        .append("svg")
        .attr("width", (ref.options.width + ref.options.margin.left + ref.options.margin.right) + "%")
        .attr("height", (ref.options.height + ref.options.margin.top + ref.options.margin.bottom) + "%")
        .append("g")
        .attr("id", "plotsvg" + ref.plot_name.replace(".", ""))
        .attr("transform", "translate(" + ref.options.marginpx.left + "," + ref.options.marginpx.top + ")");

    //this.update_data();
    var out = this.data_obj.empty_data();
    this.draw_line_plot(out["data"]);

    var cellSize = (ref.options.itemSize + 1)/2;

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, " + cellSize + ")")
        .call(ref.yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + ", " + (ref.data_obj.x_axis_values.length + 1) * ref.options.itemSize + ")")
        .call(ref.xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")

    // now add titles to the axes
    var movey = (this.data_obj.y_axis.length + 1) * this.options.itemSize;
    var movex = (this.data_obj.x_axis_values.length + 1) * this.options.itemSize;

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (-ref.options.marginpx.left / 2) + "," + (movex / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .text("Total qubits");

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (movex / 2) + "," + (movey + ref.options.marginpx.top + ref.options.marginpx.bottom/2 ) + ")") // centre below axis
        .text("Time Scaling");


    // add mouseover events
    var mouseG = svg.append("g").attr("class", "mouse-over-effects");

    var local_console = document.getElementById(this.plot_name.substring(1) + "console");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', ref.options.width + "%") // can't catch mouse events on a g element
        .attr('height', ref.options.height + "%")
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', function() {
            content = ref.data_obj.explain_data(data = null, experiment);
            local_console.innerHTML = content;
        });

    // d3.select('#plotsvg' + ref.plot_name.replace(".", "")).selectAll('rect')
    //     .data(data)
    //     .enter().append('g').append('rect')
    //     .attr('class', 'cell')
}

Type2Plot.prototype.collect_parameters = function() {
    /*
    Collect from the parameter fields in the HTML
    */
    var params = {}
    
    for (key in this.data_obj.get_default_parameters()) {
        if (!is_internal_parameter(key)) {
            params[key] = read_parameter(this.plot_name.replace(".", ""), key);
        }
    }

    //TODO: Unlock this calculation at a point
    // if (experiment.bool_distance == true) {
    //     //if the distance should be enforced
    //     //it means that the phys_error_rate has to be adapted such that the enforced distance is resulting

    //     if (this.parameters["___just_clicked"] == false) {
    //         this.parameters["___default_phys_err_rate"] = experiment.physical_error_rate;
    //     }

    //     experiment.physical_error_rate = austin_p_err(
    //         experiment.enforced_distance, 
    //         comp_target_error_per_data_round_1(
    //             experiment.safety_factor, experiment.volume))

    //     this.parameters["___just_clicked"] = true;
    // } else {
    //     //restore the phys error rate that was initially set for the experiment
    //     if (this.parameters["___just_clicked"] == true) {
    //         experiment.physical_error_rate = this.parameters["___default_phys_err_rate"];
    //     }

    //     // reset click detector
    //     this.parameters["___just_clicked"] = false;
    // }

    return params;
}

Type2Plot.prototype.draw_new_y_axis = function() {
    var ref = this;
    //
    var cellSize = (ref.options.itemSize + 1)/2;
    // 
    
    this.yScale = d3.scaleLog()
        .domain([ref.data_obj.y_axis[0], ref.data_obj.y_axis[ref.data_obj.y_axis.length - 1]])
        .range([ref.data_obj.y_axis.length * ref.options.itemSize, 0]);

    this.yAxis = d3.axisLeft()
        .scale(ref.yScale)
        .ticks(6, function(d) {
            return d.toString()[0] + "·10" + formatPower(Math.floor(Math.log10(d)));
        });
    //
    //delete the y axis
    d3.select("#plotsvg" + ref.plot_name.replace(".", "")).selectAll(".y.axis").remove();
    //
    //append the new one
    d3.select("#plotsvg" + ref.plot_name.replace(".", "")).append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, " + cellSize + ")")
        .call(ref.yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');
}

Type2Plot.prototype.update_data = function(experiment) {
    params = this.collect_parameters();

    // print(params);

    //only change if update_plot_checkbox is checked
    if (params["bool_update_plot"]) {
        console.log("update " + this.plot_name);

        var out = this.data_obj.gen_data(experiment, params);

        d3.select(this.plot_name).selectAll(".line_plot").remove();
        d3.select(this.plot_name).selectAll(".line_plot_red").remove();
        d3.select(this.plot_name).selectAll(".vertical_line").remove();

        this.draw_new_y_axis();

        for (var i = out["dist_changes"].length - 1; i >= 0; i--) {
            this.draw_vertical_line(this.data_obj.y_axis[this.data_obj.y_axis.length - 1], this.data_obj.y_axis[0], out["dist_changes"][i]["x"])
        }

        var mdpos = Math.floor(this.data_obj.x_axis_values.length / 2);
        this.draw_vertical_line(this.data_obj.y_axis[this.data_obj.y_axis.length - 1], this.data_obj.y_axis[0], this.data_obj.x_axis_values[mdpos], "no_scale_point");

        this.draw_line_plot(out["data"]);
    }
}