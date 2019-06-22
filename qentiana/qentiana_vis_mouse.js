/**
 * Mouse functions for the moving div on top of the graphs
 */

function QentianaMouse()
{
}

QentianaMouse.tooltip = null;

QentianaMouse.prototype.findToolTip = function(){
    if (QentianaMouse.tooltip == null){
        QentianaMouse.tooltip = document.getElementById("tooltip");
    }
}

QentianaMouse.prototype.mouseOut = function(){
    QentianaMouse.tooltip.innerHTML = "";
    QentianaMouse.tooltip.style.visibility = "hidden";
}

QentianaMouse.prototype.mouseOver = function(HTML_content){
    QentianaMouse.tooltip.style.visibility = "visible";
    QentianaMouse.tooltip.innerHTML = HTML_content;
}

QentianaMouse.prototype.mouseMove = function(){
    QentianaMouse.tooltip.style.top = (d3.event.pageY + 30)+"px";
    QentianaMouse.tooltip.style.left = (d3.event.pageX + 10)+"px";
}