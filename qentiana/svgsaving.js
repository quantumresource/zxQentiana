function save_as_svg(container_class_name) {
    var svg_data = document.getElementById(container_class_name).parentNode.innerHTML; //put id of your svg element here

    var head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';

    //if you have some additional styling like graph edges put them inside <style> tag
    //this font is too small
    var style = '<style>circle {cursor: pointer;stroke-width: 1.5px;}text {font: 10px arial;}path {stroke: DimGrey;stroke-width: 1.5px;}</style>';

    var full_svg = head + style + svg_data + "</svg>";
    var blob = new Blob([full_svg], {
        type: "image/svg+xml"
    });
    saveAs(blob, container_class_name.replace(".", "") + "_tradeoff.svg");
}