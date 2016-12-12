var dataset = [5, 10, 15, 20, 25, 40, 50, 100, 22, 55];

// d3.select("body")
//     .selectAll("div")
//     .data(dataset)
//     .enter()
//     .append("div")
//     .attr("class", "bar")
//     .style("height", function(d) {
//         return (10 * d) + "px";
//     });

// Reference to the svg created
var svg = d3.select("body").append("svg");

var width = 500;
var height = 500;
var barPadding = 2;
var barHeight = 4;

svg.attr("width", width)
    .attr("height", height);

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) {
        return (i * (width / dataset.length));
    })
    .attr("y", function(d) {
        return height - (d * 4);
    })
    .attr("width", function(d) {
        return width / dataset.length - barPadding;
    })
    .attr("height", function(d) {
        return d * 4;
    })
    .attr("fill", function(d) {
        return "rgb(0, 0, " + (d * 10) + ")";
    });

// Labels
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("x", function(d, i) {
        var barw = width / dataset.length;
        return i * (barw) + (barw - barPadding) / 2;
    })
    .attr("y", function(d) {
        return (height - (d * 4)) + 20;
    })
    .attr("fill", "white")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("text-anchor", "middle");

// var circles = svg.selectAll("circle")
//     .data(dataset)
//     .enter()
//     .append("circle");
//
// circles.style("fill", "black")
//     .attr("cx", function(d, i) {
//         console.log(d);
//         return (i * (d + 20)) + 25;
//     })
//     .attr("cy", height / 2)
//     .attr("r", function(d) {
//         return d;
//     });
