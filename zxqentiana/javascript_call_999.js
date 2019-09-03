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

function phase_color(phase)
{
    if(phase.indexOf("/") == -1)
    {
        //this is a normal spider?
        return "olive"
    }
    else
    {
        var lastChar = phase[phase.length - 1]
        if(lastChar == "2")
            return "green"
        if(lastChar == "4")
            return "lime"
    }
    //default - something went bad?
    return "yellow"
}

function node_color(d)
{
    if (d.t == 0){
        return "black";
    } 
    else if (d.t == 1){
        return phase_color(d.phase)
    }
    else if (d.t == 2){
        //what is this?
        return "red";
    } 
}

function edge_color(d)
{
    if (d.t == 1) 
        return "black";
    if (d.t == 2)
        return "#0088ff";
    //default - something went bad?
    return "yellow"
}

var my3DGraph = ForceGraph3D()
    (document.getElementById('fig_circuit'))
    .nodeRelSize(5)
    .linkWidth(1)
    .linkOpacity(1)
    .backgroundColor("#ffffff")
    .nodeColor(d => node_color(d))
    .linkColor(d => edge_color(d))
    .cameraPosition({ x: 0, y: 0, z: 200 })
    .width($('#fig_circuit').width())
    .height($('#fig_circuit').height())
    .nodeLabel(d => `<span style="color: black">${d.phase}</span>`)
    .nodeThreeObjectExtend(true)
    .nodeThreeObject(d => {
        const sprite = new SpriteText(d.phase);
        sprite.color = "black";
        sprite.textHeight = 14;
        return sprite;
      })
/*
    Parameters for the display inside the chart div
*/
var vis_options = {};
//these are percentages
vis_options.margin = { top: 0, right: 0, bottom: 20, left: 20 };