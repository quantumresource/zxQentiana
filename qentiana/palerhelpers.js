function paler_analysis(data) {
    var curr_volume = approx_mult_factor(data.y, experiment.volume);
    var curr_space = approx_mult_factor(data.x, experiment.footprint);

    var vol_min_depth = Math.floor(experiment.volume / curr_space);
    if (experiment.volume % curr_space != 0) {
        vol_min_depth++;
    }

    var volume_in_case_no_depth_scale = experiment.footprint * vol_min_depth;
    var threshold = Math.floor(curr_volume / volume_in_case_no_depth_scale);
    if (curr_volume % volume_in_case_no_depth_scale != 0) {
        threshold++;
    }

    /*
        Check if the volume of the computed threshold implies a distance that is equal to the threshold
    */
    var recomputed_volume = volume_in_case_no_depth_scale * threshold;
    
    var recalc = calculate_total(recomputed_volume, experiment.footprint, experiment.physical_error_rate);

    var ret = {
        dist: recalc.dist,
        ok: (recalc.dist <= threshold),
        threshold: threshold,
        volume: recomputed_volume
    }

    return ret;
}