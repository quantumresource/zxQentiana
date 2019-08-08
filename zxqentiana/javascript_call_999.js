qentMouse.findToolTip();

var myCodeMirror000 = CodeMirror.fromTextArea(document.getElementById("txt_script_1"), {
    mode: {name: "python",
            version: 3,
            singleLineStringErrors: false
        },
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true
});
myCodeMirror000.setSize(null, "400px");

var myCodeMirror001 = CodeMirror.fromTextArea(document.getElementById("txt_script_2"), {
    mode: {name: "python",
            version: 3,
            singleLineStringErrors: false
        },
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true
});
myCodeMirror001.setSize(null, "400px");


/*
    Parameters for the display inside the chart div
*/
var vis_options = {};
//these are percentages
vis_options.margin = { top: 0, right: 0, bottom: 20, left: 20 };

function firstrun()
{
    /*
        Execute the first Python
    */

    load_experiments_from_JSON();

    add_event_handlers();

    plot_objects[".plot1"] = new Type2Plot(data_objects[".plot1"],".plot1", vis_options);
    plot_objects[".plot2"] = new Type1Plot(data_objects[".plot2"],".plot2", vis_options);
    plot_objects[".plot3"] = new Type1Plot(data_objects[".plot3"], ".plot3", vis_options);
    plot_objects[".plot4"] = new Type1Plot(data_objects[".plot4"], ".plot4", vis_options);

    for (var index in plot_names) {
        var pl_name = plot_names[index];
        plot_objects[pl_name].init_visualisation();
    }

    update_plots();
}