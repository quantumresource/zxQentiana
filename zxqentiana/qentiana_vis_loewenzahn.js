function LoewenzahnData()
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
    this.explanation = "Given a fixed number of physical qubits, what is the total success probability? The higher the probability the lighter color.";
    //
    this.parameters = {};
    this.parameters["bool_update_plot"] = false;
    this.parameters["total_num_physical_qubits"] = 500;
}

LoewenzahnData.prototype.get_max_dist_from_qubits = function(logical_qubits, total_physical_qubits) {
    // Calculates the maximum distance given a fixed number of physical qubits

    if (logical_qubits > total_physical_qubits) {
        return -1;
    }
    var ret = Math.floor(Math.sqrt(total_physical_qubits / logical_qubits));
    if (ret <= 2)
        return 1;

    return ret;
}

LoewenzahnData.prototype.total_err = function(indiv_err, volume) {
    // given a per step error rate calculate the total error of the computation
    return Math.pow(1 - indiv_err, volume);
}

LoewenzahnData.prototype.gen_data = function() {

    var space_min   = experiment.footprint;
    var volume_min  = experiment.volume;
    var p_err = experiment.physical_error_rate;

    //parameters are collected by the plot
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

LoewenzahnData.prototype.empty_data = function()
{
    var data = [];

    for (var i = 0; i < this.global_v.length; i++) {
        for (var j = 0; j < this.global_s.length; j++) {
            //maybe change names for this data array because different meaning of output
            data.push({
                x: this.global_s[j],
                y: this.global_v[i],
                dist: 0,
                indiv_error: 0,
                total_volume: 0,
                qubits_used: 0,
                total_error: 0
            })
        }
    }

    return data;
}

LoewenzahnData.prototype.color_interpretation = function(d) {
    return "rgb(" + to_rgb(d.total_error) + "," + to_rgb(d.total_error) + "," + to_rgb(d.total_error) + ")";
}

LoewenzahnData.prototype.compute_over_content = function(data)
{
    var content = "";
    content += "Distance at point (" + data.x + ", " + data.y + "): <br>" + data.dist + " <br>";
    content += "error rate in unit cell: " + data.indiv_error + " with a total volume of " + data.total_volume + "<br>";
    content += "Total success probability: " + data.total_error + "<br>";

    return content;
}