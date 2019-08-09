function Type1Plot(data_obj, name, vis_options) {
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

    this.xScale_local = d3.scaleLinear()
        .domain([ref.data_obj.global_s[0], ref.data_obj.global_s[ref.data_obj.global_s.length - 1]])
        .range([0, ref.data_obj.global_s.length * ref.options.itemSize]);

    this.xAxis = d3.axisBottom()
        .scale(ref.xScale_local);

    this.yScale_local = d3.scaleLog()
        .domain([ref.data_obj.global_v[0], ref.data_obj.global_v[ref.data_obj.global_v.length - 1]])
        .range([ref.data_obj.global_v.length * ref.options.itemSize, 0]);

    this.yAxis = d3.axisLeft()
        .scale(ref.yScale_local)
        .ticks(6, function(d) {
            return 10 + formatPower(Math.round(Math.log(d) / Math.LN10));
        });

    // 
    create_description(this.plot_name.replace(".", ""), this.data_obj);

    var ppp = this.data_obj.get_default_parameters()
    for (key in ppp) {
        create_parameter(this.plot_name.replace(".", ""), key, ppp[key]);
    }
}

Type1Plot.prototype.init_visualisation = function() {
    var ref = this;

    var data = this.data_obj.empty_data();

    var svg = d3.select(this.plot_name)
        .append("svg")
        .attr("width", (ref.options.width + ref.options.margin.left + ref.options.margin.right) + "%")
        .attr("height", (ref.options.height + ref.options.margin.top + ref.options.margin.bottom) + "%")
        .append("g")
        .attr("id", "plotsvg" + ref.plot_name.replace(".", ""))
        .attr("transform", "translate(" + ref.options.marginpx.left + "," + ref.options.marginpx.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(ref.yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate( 0 , " + ((ref.data_obj.global_v.length + 1) * ref.options.itemSize + 2) + ")")
        .call(ref.xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start");

    // now add titles to the axes
    var movey = (ref.data_obj.global_v.length + 1) * ref.options.itemSize;
    var movex = (ref.data_obj.global_s.length + 1) * ref.options.itemSize;

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (-ref.options.marginpx.left / 2) + "," + (movex / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .text("Time Factor");

    svg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (movex / 2) + "," + (movey + ref.options.marginpx.top + ref.options.marginpx.bottom/2 ) + ")") // centre below axis
        .text("Space Factor");
    
    var local_console = document.getElementById(this.plot_name.substring(1) + "console");

    d3.select('#plotsvg' + ref.plot_name.replace(".", "")).selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', ref.options.itemSize + 1)
        .attr('height', ref.options.itemSize + 1)
        .attr('y', function(d) {
            return ref.yScale_local(d.y);
        })
        .attr('x', function(d) {
            return ref.xScale_local(d.x);
        })
        .attr('fill', function(d) {
            return ref.data_obj.color_interpretation(d);
        })
        .on('mouseover', function(d) {
            content = ref.data_obj.explain_data(d, experiment);
            qentMouse.mouseOver(local_console, content);
        })
        .on('mousemove', qentMouse.mouseMove)
        .on('mouseout', qentMouse.mouseOut);
}

Type1Plot.prototype.collect_parameters = function()
{
    var params = {}
    for (key in this.data_obj.get_default_parameters()) {
        if (!is_internal_parameter(key)) {
            params[key] = read_parameter(this.plot_name.replace(".", ""), key);
        }
    }
    return params;
}

Type1Plot.prototype.update_data = function(experiment) {
    var ref = this;

    var params = this.collect_parameters();

    var data = [];

    if (params["bool_update_plot"]) {
        console.log("update " + this.plot_name);
        data = this.data_obj.gen_data(experiment, params);
    }
    else
    {
        data = this.data_obj.empty_data();
    }

    d3.select(this.plot_name).selectAll("rect")
        .data(data)
        .transition().duration(1000)
        .style("fill", function(d) {
            return ref.data_obj.color_interpretation(d);
        });
}