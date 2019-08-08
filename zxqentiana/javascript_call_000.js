var pyZXJS = new pyZXJavaScript();
/*
*/
var qentMouse = new QentianaMouse();
/**
 * Default empty list of experiments
 */
var experiments = new Object();
/*
    The current experiment
*/
var experiment = null;

/*
    Each plot has a name, and it is identified by the id of the corresponding DIV
*/
var plot_names = [".plot1", ".plot2", ".plot3", ".plot4"];
var plot_objects = {};
/*
    The data generators (res analysis) objects from Python will be stored here
    In python_call_000.py this object is imported
*/
var data_objects = {};

function update_plots(names) {
    var all_names = names;

    if((all_names == undefined) || (all_names.length == 0))
    {
        all_names = plot_names
    }
    console.log(all_names)

    for (var index in all_names) {
        var plot_name = all_names[index];
        plot_objects[plot_name].update_data(experiment);
    }

    update_labels();

    return 0;
}

function update_labels() {
    var depth_input = document.getElementById("input_depth_field");
    var volume_input = document.getElementById("input_volume_field");
    var logical_qubits_input = document.getElementById("input_qubit_field");
    var phys_err_rate_input = document.getElementById("input_err_field");
    var force_distance_input = document.getElementById("input_force_distance");
    var distance_input = document.getElementById("input_distance_field");
    var routing_overhead_input = document.getElementById("input_routing_overhead");

    depth_input.value = experiment.depth;
    volume_input.value = experiment.volume;
    logical_qubits_input.value = experiment.footprint;
    phys_err_rate_input.value = experiment.physical_error_rate;
    force_distance_input.checked = experiment.bool_distance;
    distance_input.value = experiment.enforced_distance;
    routing_overhead_input.value = experiment.routing_overhead;

    var output0 = document.getElementById("value_depth");
    output0.innerHTML = depth_input.value;

    var output1 = document.getElementById("value_volume");
    output1.innerHTML = volume_input.value;

    var output2 = document.getElementById("value_qubits");
    output2.innerHTML = logical_qubits_input.value;

    var output3 = document.getElementById("value_error");
    output3.innerHTML = phys_err_rate_input.value;

    var output4 = document.getElementById("value_distance");
    output4.innerHTML = distance_input.value;

    var output5 = document.getElementById("routing_overhead");
    output5.innerHTML = routing_overhead_input.value;
}

function add_event_handlers() {
    var depth_input = document.getElementById("input_depth_field");
    // var volume_input = document.getElementById("input_volume_field");
    var logical_qubits_input = document.getElementById("input_qubit_field");
    var phys_err_rate_input = document.getElementById("input_err_field");
    var force_distance_input = document.getElementById("input_force_distance");
    var distance_input = document.getElementById("input_distance_field");
    var routing_overhead_input = document.getElementById("input_routing_overhead");

    var select_experiments_input = document.getElementById("select_experiments");

    update_labels();

    // Update the current slider value (each time you drag the slider handle)
    depth_input.onchange = function () {

        experiment.depth = this.value;

        //the volume is the number of qubits x time x routing factor
        experiment.volume = (experiment.routing_overhead * experiment.footprint) * experiment.depth;
        update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    // volume_input.onchange = function() {
    //     volume_min = this.value;
    //     update_plots();
    // }

    // Update the current slider value (each time you drag the slider handle)
    logical_qubits_input.onchange = function () {
        experiment.footprint = this.value;

        experiment.volume = (experiment.routing_overhead * experiment.footprint) * experiment.depth;

        update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    phys_err_rate_input.onchange = function () {
        experiment.physical_error_rate = this.value;
        // console.log(experiment.physical_error_rate)
        update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    force_distance_input.onchange = function () {
        experiment.bool_distance = this.checked;
        update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    distance_input.onchange = function () {
        experiment.enforced_distance = this.value;
        if (experiment.bool_distance) {
            update_plots();
        }
    }

    routing_overhead_input.onchange = function () {
        experiment.routing_overhead = this.value;
        update_plots();
    }

    select_experiments_input.onchange = function () {
        experiment = experiments[this.value];
        // console.log(experiment);
        update_plots();
    }
}

function load_experiments_from_JSON() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'zxqentiana/stored_experiments.json', false);
    xmlhttp.send();

    experiments = JSON.parse(xmlhttp.responseText);
    //default experiment when loaded
    experiment = experiments["pyZX"];

    select = document.getElementById('select_experiments');
    for (var name in experiments) {

        if(name.startsWith("_"))
            //skip internal names
            continue;

        var opt = document.createElement('option');
        opt.value = name;
        opt.innerHTML = name;
        select.appendChild(opt);
    }
}

function runscript(mirror) {
    //read script
    scriptLines = mirror.getValue();
    //run script
    pyodide.runPython(scriptLines);
}