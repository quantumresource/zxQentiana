/*
    Utility functions
*/

// use for better axis formating
var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";

var formatPower = function(d) {
    return (d + "").split("").map(function(c) {
        return superscript[c];
    }).join("");
};

var formatTick = function(d) {
    return 10 + (d < 0 ? "⁻" : "") + formatPower(Math.round(Math.log(d) / Math.LN10));
};

function create_2d_array(dim1, dim2) {
    var ret = new Array(dim1);
    for (var i = 0; i < dim1; i++) {
        ret[i] = new Array(dim2);
    }
    return ret;
}

var local_factorial_cache = {};

function local_factorial(n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    if (local_factorial_cache[n + ""] > 0) {
        return local_factorial_cache[n + ""];
    }

    var part = 1;
    for (var fn = 2; fn <= n; fn++) {
        if (local_factorial_cache[fn + ""] > 0) {
            part = local_factorial_cache[fn + ""];
        } else {
            part = part * fn;
            local_factorial_cache[fn + ""] = part;
        }
    }
    local_factorial_cache[n + ""] = part;

    return local_factorial_cache[n + ""];
}

// precompute values in cache
local_factorial(100);

function to_rgb(param) {
    var ret = (param > 1 ? 255 : Math.round(param * 255));
    return ret;
}

function from_rgb(param) {
    var ret = (param == 255 ? 2 : param / 255);
    return ret;
}

function create_description(elem_name, text) {
    // this.explanation = "Given a fixed number of physical qubits, what is the total success probability? The higher the probability the lighter color.";

    // var desc = document.createElement("div");

    // desc.appendChild(document.createTextNode(text));
    // desc.appendChild(document.createElement("br"));
    // desc.setAttribute("class", "description");

    // var alink = document.createElement("a");
    // alink.setAttribute("href", "#");
    // alink.setAttribute("onclick", "save_as_svg(\"plotsvg" + elem_name + "\")");
    // alink.innerHTML = "Download SVG";
    // desc.appendChild(alink);

    // var container = document.getElementsByClassName(elem_name)[0];
    // container.appendChild(desc);

    document.getElementById(elem_name+"desc").innerText = text;
}

function get_container_dimension(containerID, dimName)
{
    return document.getElementsByClassName(containerID)[0].parentElement[dimName];
}

function create_parameter(elem_name, param_name, param_default_value) {
    if (param_name.startsWith("___")) {
        //this should not be displayed
        //it is an internal parameter
        return;
    }

    // var container = document.getElementsByClassName(elem_name)[0];
    var container = document.getElementById(elem_name + "params")

    var divcont = document.createElement("div");
    divcont.setAttribute("class", "description");
    divcont.appendChild(document.createTextNode(param_name));

    var inputx = document.createElement("input");
    inputx.setAttribute("onchange", "update_plots()");

    inputx.setAttribute("id", elem_name + "_" + param_name);
    inputx.setAttribute("name", elem_name + "_" + param_name);

    container.appendChild(divcont);
    var elementinput = divcont.appendChild(inputx);

    if (is_bool_parameter(param_name)) {
        elementinput.type = "checkbox";
        if (parseBool(param_default_value)) {
            elementinput.checked = true;

            console.log(elementinput.checked);
        }
    } else {
        elementinput.type = "number";
        elementinput.step = "1";
        elementinput.value = param_default_value;
    }
}

function read_parameter(elem_name, param_name) {
    var obj = document.getElementById(elem_name + "_" + param_name);

    var ret = null;

    if (is_bool_parameter(param_name)) {
        ret = parseBool(obj.checked);
    } else {
        ret = parseInt(obj.value);
    }

    return ret;
}

function update_vis_dimensions(options, plot_name, nr_items)
{
    //Compute the width and height percentages based on the margins
    options.width = 100 - (options.margin.left + options.margin.right);
    options.height = 100 - (options.margin.top + options.margin.bottom);
    
    //Determine the min value of the chart
    cheight = get_container_dimension(plot_name.substring(1), "offsetHeight");
    cwidth = get_container_dimension(plot_name.substring(1), "offsetWidth");

    minsize = Math.min(cheight, cwidth);
    minsize *= (options.width/100.0);

    options.itemSize = (minsize / nr_items);

    //Compute margins in pixels
    options.marginpx = { 
        top: options.margin.top * minsize/100.0, 
        right: options.margin.right * minsize/100.0, 
        bottom: options.margin.bottom * minsize/100.0, 
        left: options.margin.left * minsize/100.0};

    //
}

function set_parameter(elem_name, param_name, value) {
    var obj = document.getElementById(elem_name + "_" + param_name);
    obj.checked = value
}

function parseBool(stringbool) {
    var strb = stringbool + "";
    return (strb.toLowerCase() === "true");
}

function is_internal_parameter(param_name) {
    if (param_name.startsWith("___")) {
        //this should not be displayed
        //it is an internal parameter
        return true;
    }
    return false;
}

function is_bool_parameter(param_name) {
    if (param_name.startsWith("bool")) {
        //this should not be displayed
        //it is an internal parameter
        return true;
    }
    return false;
}