// Gate error rate that sets how quickly logical errors are suppressed. 1e-3 means a factor of 10 suppression with each increase of d by 2.
// var austin_characteristic_gate_error_rate = 0.001;

/*
Computes the logical failure rate given the gate error rate and the distance
*/
function austin_p_logical(p_gate, d)
{
    return 0.1 * Math.pow((100*p_gate), ((d + 1) / 2));
}

/*
Computes a per data round error rate given a safety factor and a volume
*/
function comp_target_error_per_data_round_1(safety_factor, total_volume)
{
    return 1 / (safety_factor * total_volume);
}

/*
Computes a per data round error rate given a gate error rate and a distance
*/
function comp_target_error_per_data_round_2(p_gate_err, distance)
{
    return austin_p_logical(p_gate_err, distance);
}

/*
Computes a safety factor from target error per data round and total volume
*/
function inv_target_error_per_data_round(target_error_data_round, total_volume)
{
    return 1 / (target_error_data_round  * total_volume);
}

/*
Computes the distance given the gate error rate and the target_error_data_round
*/
function austin_distance(p_gate, target_error_data_round)
{
    var min_dist = 3;
    var max_dist = 500;
    for (var d = min_dist; d <= max_dist; d = d + 2)
    {
        if(austin_p_logical(p_gate, d) < target_error_data_round)
        {
            return d;
        }
    }
    console.log("Austin_distance_error!" + p_gate + " " + target_error_data_round);
    // throw("Austin_distance_error!" + p_gate + " " + target_error_data_round);

    return 0;
}

/*
Computes the gate error rate given the target distance and teh target logical failure rate
*/
function austin_p_err(distance, p_l)
{
    var ret = Math.pow (10 * p_l, 2/(distance + 1) )/100;
    
    console.log(ret);
    
    return ret;
}

function austin_data_qubits(space, total_volume, safety_factor, characteristic_gate_error_rate)
{
    var target_error_per_data_round = comp_target_error_per_data_round_1(safety_factor, total_volume);
    
    if(target_error_per_data_round == 0)
    {
        console.log("FLOAT ZERO!" + total_volume);
    }
    
    var data_code_distance = austin_distance(characteristic_gate_error_rate, target_error_per_data_round);
    
    // var num_data_qubits = space * 2 * Math.pow(data_code_distance, 2);
    var num_data_qubits = number_of_physical_qubits(data_code_distance, space);
    
    var ret = {
        distance : data_code_distance,
        qubits: num_data_qubits
    }
    return ret;
}