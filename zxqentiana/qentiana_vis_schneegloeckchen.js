function SchneegloeckchenData()
{
    /*
        Parameters
    */
    this.nr_items = 100;
    // log spaced volume scaling factor
    this.global_v = local_logspace(-2, 2, this.nr_items);
    // scaling factor space
    this.global_s = local_linspace(0.1, 2, this.nr_items);
    //
    this.explanation = "Comparison of two different optimization heuristics (time and space). In blue/green areas space optimization is better compared to the time optimization. Purple/red areas are not self-consistent (not allowed) and in white areas the time optimization is superior.";
    //
    this.parameters = {};
    this.parameters["bool_update_plot"] = false;
}

SchneegloeckchenData.prototype.compute_over_content = function(data)
{
    var curr_volume = approx_mult_factor(data.y, experiment.volume);
    var curr_space = approx_mult_factor(data.x, experiment.footprint);

    content = "";
    content += data.x + " " + data.y + "->" + data.ratio + "<br>";
    content += "distance vol: " + data.dist_opt_vol + " having a hardware footprint of " + curr_space + " log qubits <br>";
    content += "distance space: " + data.dist_opt_space + " for a volume of " + curr_volume + "<br>";

    content += "tradeoff time scaling threshold<br>" + (data.x * data.y) + "<br>";
    content += "minimum scaling should be below tradeoff threshold:<br>" + data.dist_opt_space + "<br>";

    content += "<br>";
    content += "qub vol: " + data.nr_target_vol + "<br>";
    content += "qub spc: " + data.nr_target_space + "<br>";

    return content;
}

SchneegloeckchenData.prototype.color_interpretation = function(d) {
    var component_green = data.ratio;
    var component_red = data.ratio;
    var component_blue = data.ratio;

    var analysis = paler_analysis(data);

    if (analysis.ok)
        component_green = 255;
    else
        component_red = 255;

    return "rgb(" + to_rgb(component_red) + "," + to_rgb(component_green) + "," + to_rgb(component_blue) + ")";
}


SchneegloeckchenData.prototype.gen_data = function() {
    
    var volume_min = experiment.volume;
    var space_min = experiment.footprint;
    var p_err = experiment.physical_error_rate;

    // 2D Array
    var data = new Array();

    for (var i = 0; i < this.global_v.length; i++) {
        for (var j = 0; j < this.global_s.length; j++) {
            var space_param = approx_mult_factor(this.global_s[j], space_min);
            var ret_1 = calculate_total(volume_min, space_param, p_err);

            var vol_param = approx_mult_factor(this.global_v[i], volume_min);
            var ret_2 = calculate_total(vol_param, space_min, p_err);

            if ((ret_1 == "ERROR") || (ret_2 == "ERROR")) {
                console.log("SOMETHING WENT WRONG!!!");
            }

            var ratio = (ret_2["number_of_physical_qubits"]) / (ret_1["number_of_physical_qubits"]);

            data.push({
                x: this.global_s[j],
                y: this.global_v[i],
                dist_opt_vol: ret_1.dist,
                dist_opt_space: ret_2.dist,
                nr_target_vol: ret_1["number_of_physical_qubits"],
                nr_target_space: ret_2["number_of_physical_qubits"],
                ratio: ratio
            })
        }
    }

    return data;
}

SchneegloeckchenData.prototype.empty_data = function() {
    // 2D Array
    var data = new Array();

    for (var i = 0; i < this.global_v.length; i++) {
        for (var j = 0; j < this.global_s.length; j++) {
            data.push({
                x: this.global_s[j],
                y: this.global_v[i],
                dist_opt_vol: 0,
                dist_opt_space: 0,
                nr_target_vol: 0,
                nr_target_space: 0,
                ratio: 0
            })
        }
    }

    return data;
}

// SchneegloeckchenData.prototype.color_interpretation = function(data) {
//     var component_green = data.ratio;
//     var component_red = data.ratio;
//     var component_blue = data.ratio;

//     var analysis = paler_analysis(data);

//     if (analysis.ok)
//         component_green = 255;
//     else
//         component_red = 255;

//     return "rgb(" + to_rgb(component_red) + "," + to_rgb(component_green) + "," + to_rgb(component_blue) + ")";
// }