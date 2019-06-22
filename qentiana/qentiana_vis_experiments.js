/*
    TODO: Repair bug when determining error rate from forced distance
    Below we are forcing much lower distances such that the one we compute is the commented one
    APPROXIMATION ERRORS
*/


experiments = {};

experiments["pyZX"] = {
    volume : 500,
    footprint : 10,
    depth: 50,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 7,
    safety_factor : 100
}

experiments["Shor 4096"] = {
    volume : 8.36661126433567E+016,
    footprint : 18447,
    depth: 1,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 34.7,
    safety_factor : 200
};

experiments["Shor 1024"] = {
    volume : 327618727122432,
    footprint : 4623,
    depth: 1,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 30.7,//31,
    safety_factor : 200
};

experiments["Chem 250"] = {
    volume : 756142777500,
    footprint : 512,
    depth: 1,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 24.7,//29,
    safety_factor : 9900
};

experiments["Chem 54"] = {
    volume : 4591836000,
    footprint : 185,
    depth: 1,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 18.7,//23,
    safety_factor : 9900
};

experiments["Q100"] = {
    volume : 131250000000,
    footprint : 150,
    depth: 1,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 24.7,
    safety_factor : 9900
};

experiments["Bristlecone"] = {
    volume : 12,
    footprint : 6,
    depth: 2,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 200,
    bool_distance: false,
    enforced_distance: -1,
    safety_factor: 99
};

experiments["15-to-1 Distillation"] = {
    volume : 23 * 11,
    footprint : 11,
    physical_error_rate : 0.001,
    //params to the chart classes
    routing_overhead: 50,
    bool_distance: true,
    enforced_distance: 30.7,
    safety_factor: 9900
};