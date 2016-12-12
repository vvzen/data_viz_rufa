var dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88]
];

var width = 1000;
var height = 500;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// scaling
var xPadding = 40;
var yPadding = 40;
var datasetMaxValueX = d3.max(dataset, function(d) {
    return d[0];
});
var datasetMinValueX = d3.min(dataset, function(d) {
    return d[0];
})
var datasetMaxValueY = d3.max(dataset, function(d) {
    return d[1];
});
var datasetMinValueY = d3.min(dataset, function(d) {
    return d[1];
});

// mapping the values in the dataset to the svg width and height
var xScale = d3.scale.linear()
    .domain([0, datasetMaxValueX])
    .range([xPadding, width - xPadding * 2])
    .nice();

var yScale = d3.scale.linear()
    .domain([0, datasetMaxValueY])
    .range([yPadding, height - yPadding * 2])
    .nice();

// Circles
var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle");

var circleRadius = function(d) {
    return d[1] / 8;
}

circles.attr("cx", function(d) {
        return xScale(d[0]);
    })
    .attr("cy", function(d) {
        return yScale(d[1]);
    })
    .attr("r", function(d) {
        return circleRadius(d);
    })
    .attr("fill", "black");

// Labels
var labelPadding = 3;
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d[0] + ", " + d[1];
    })
    .attr("x", function(d, i) {
        return xScale(d[0]) + circleRadius(d) + labelPadding;
    })
    .attr("y", function(d) {
        return yScale(d[1]) - circleRadius(d) - labelPadding;
    })
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("text-anchor", "middle");

// Axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

// Attach x axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height - yPadding) + ")")
    .call(xAxis);
// Attach y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + xPadding + ", 0)")
    .call(yAxis);
