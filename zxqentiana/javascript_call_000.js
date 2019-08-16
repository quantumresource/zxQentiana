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
    For loading circuit files and not random circuits
*/
var circuit_url_from_js = null;
var fname_circuit_url_from_js = null;

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

    update_experiment_htmls();

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

    return 0;
}

function update_experiment_htmls() {
    var depth_input = document.getElementById("input_depth_field");
    var logical_qubits_input = document.getElementById("input_qubit_field");
    var phys_err_rate_input = document.getElementById("input_err_field");
    var force_distance_input = document.getElementById("input_force_distance");
    var distance_input = document.getElementById("input_distance_field");
    var routing_overhead_input = document.getElementById("input_routing_overhead");

    depth_input.value = experiment["depth_units"];
    logical_qubits_input.value = experiment["footprint"];
    phys_err_rate_input.value = experiment["physical_error_rate"];
    force_distance_input.checked = experiment["bool_distance"];
    distance_input.value = experiment["enforced_distance"];
    routing_overhead_input.value = experiment["routing_overhead"];
}

function add_event_handlers() {
    var depth_input = document.getElementById("input_depth_field");
    var logical_qubits_input = document.getElementById("input_qubit_field");
    var phys_err_rate_input = document.getElementById("input_err_field");
    var force_distance_input = document.getElementById("input_force_distance");
    var distance_input = document.getElementById("input_distance_field");
    var routing_overhead_input = document.getElementById("input_routing_overhead");

    // Update the current slider value (each time you drag the slider handle)
    depth_input.onchange = function () {
        experiment["depth_units"] = this.value;
        // update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    logical_qubits_input.onchange = function () {
        experiment["footprint"] = this.value;
        // update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    phys_err_rate_input.onchange = function () {
        experiment["physical_error_rate"] = this.value;
        // console.log(experiment.physical_error_rate)
        // update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    force_distance_input.onchange = function () {
        experiment["bool_distance"] = this.checked;
        // update_plots();
    }

    // Update the current slider value (each time you drag the slider handle)
    distance_input.onchange = function () {
        experiment["enforced_distance"] = this.value;
        // if (experiment["bool_distance"]) {
        //     update_plots();
        // }
    }

    routing_overhead_input.onchange = function () {
        experiment["routing_overhead"] = this.value;
        // update_plots();
    }

    var select_experiments_input = document.getElementById("select_experiments");
    var select_circuits_input = document.getElementById("select_circuits");

    select_experiments_input.onchange = function () {
        experiment = experiments[this.value];
        // console.log(experiment);
        update_plots();
    }

    select_circuits_input.onchange = function(){
        fname_circuit_url_from_js = select_circuits_input.options[select_circuits_input.selectedIndex].text; 
        circuit_url_from_js = select_circuits_input.value;
        
        runscript(myCodeMirror001);
    }
}

function load_experiments_from_JSON() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'zxqentiana/stored_experiments.json', false);
    xmlhttp.send();

    experiments = JSON.parse(xmlhttp.responseText);

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

    //default experiment when loaded
    experiment = experiments["manual"];
}

function load_circuits_from_JSON() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'zxqentiana/zx_circuits.json', false);
    xmlhttp.send();

    circuits = JSON.parse(xmlhttp.responseText);

    select = document.getElementById('select_circuits');
    for (var name in circuits) {
        var opt = document.createElement('option');

        opt.value = circuits[name];
        opt.innerHTML = name;
        select.appendChild(opt);
    }

    // The default values
    circuit_url_from_js = "random";
    fname_circuit_url_from_js = "random";
}

function runscript(mirror) {
    //read script
    scriptLines = mirror.getValue();
    //run script
    pyodide.runPython(scriptLines);
}

function load_remote_file(url)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();

    return xmlhttp.responseText;
}