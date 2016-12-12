// Main sketches vars
var width = window.innerWidth - 20;
var height = window.innerHeight - 20;

// create svg
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var center = [12.5102487, 41.8931614];

var projection = d3.geoMercator()
    .scale(170000)
    .center(center)
    .translate([width / 2, height / 2]);
//.translate([(width / 2) - 2200, (height / 2) + 8000]);

// Load italy data for debug
// d3.json("files/italy.json", function(err, italy) {
//     if (err) return console.log(err);
//     //console.log(italy);
//
//     var subunits = topojson.feature(italy, italy.objects.subunits).features;
//
//     var path = d3.geoPath()
//         .projection(projection);
//
//     svg.selectAll(".italy")
//         .data(subunits)
//         .enter()
//         .append("path")
//         .attr("class", "italy")
//         .attr("d", path)
//         .attr("fill", "#f00");
//
//     // svg.append("circle")
//     //     .attr("cx")
// });

// d3.json("files/rome_streets_topo.json", function(err, data) {
//     if (err) return console.log(err);
//
//     var streets = topojson.feature(data, data.objects.rome_streets).features;
//
//     // Create a path using the projection
//     // a list of points becomes a path
//     var path = d3.geoPath()
//         .projection(projection);
//
//     // Draw the streets
//     svg.selectAll(".street")
//         .data(streets)
//         .enter()
//         .append("path")
//         .attr("class", "street")
//         .attr("d", path)
//         .attr("fill", "#000");
//
//     console.log(streets);
// });

d3.json("files/rome_bus_stops.json", function(err, data) {
    if (err) return console.log(err);

    // console.log(data);

    var romeBusStops = topojson.feature(data, data.objects.rome_bus_stops).features;

    // for (var i = 0; i < 10; i++) {
    //     console.log(romeBusStops[i].geometry.coordinates);
    // }

    console.log(romeBusStops);

    svg.selectAll(".bus-stop-circle")
        .data(romeBusStops)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) {
            var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
            return coords[0];
        })
        .attr("cy", function(d) {
            var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
            return coords[1];
        });
});

// Load bus stops data
// d3.csv("files/bus_stops_roma.csv", function(err, bus_stops) {
//     if (err) return console.log(err);
//
//     //console.log(bus_stops);
//
//     svg.selectAll(".bus-stop-circle")
//         .data(bus_stops)
//         .enter()
//         .append("circle")
//         .attr("r", 4)
//         .attr("cx", function(d) {
//             //var coords = projection([d.stop_long, d.stop_lat]);
//             var coords = projection([d.stop_lon, d.stop_lat]);
//             //console.log(coords);
//             return coords[0];
//         })
//         .attr("cy", function(d) {
//             var coords = projection([d.stop_lon, d.stop_lat]);
//             return coords[1];
//         })
//         .on("mouseover", function(d) {
//             d3.select(this).classed("bus-stop-circle-over", true);
//             console.log(d.stop_name);
//         });
// });
