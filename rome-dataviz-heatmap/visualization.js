// DEBUG vars
var DEBUG_HEATMAP = false;

// Global vars
var width = window.innerWidth - 20;
var height = window.innerHeight - 20;
var currentHotspot;
var hotspotsArray = [];
var totalInjuried = 0;
var totalDeaths = 0;

// MATH
function dist(x1, y1, x2, y2) {
    var dx = 0;
    var dy = 0;

    dx = x2 - x1;
    dx = dx * dx;

    dy = y2 - y1;
    dy = dy * dy;

    return Math.sqrt(dx + dy);
}

// create svg
var svg = d3.select("body")
    .append("svg")
    .attr("id", "svg-container")
    .attr("width", width)
    .attr("height", height);

var mapCenter = [12.5102487, 41.8931614];

// HEATMAP
var redGradient = {
    '.7': 'rgb(227, 187, 43)',
    '.99': 'rgb(241, 16, 164)'
}
var blueGradient = {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '.7': 'rgb(43, 227, 188)',
    '.99': 'rgb(36, 51, 254)'
};
// init heatmap
var heatmapConfig = {
    container: document.getElementById('heatmapContainer'),
    radius: 8,
    maxOpacity: .7,
    minOpacity: 0,
    blur: .99,
    gradient: redGradient
};
var heatmap = h337.create(heatmapConfig);

// used to add new element to heatmap
function myHeatData(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
}

var projection = d3.geoMercator()
    .scale(170000)
    .center(mapCenter)
    .translate([width / 2, height / 2]);

var screenCenter = projection([mapCenter[0], mapCenter[1]]);
console.log("screenCenter: " + screenCenter);

// Load streets
d3.json("files/rome_streets.json", function(err, data) {
    if (err) return console.log(err);

    //console.log("streets data:");
    var streets = topojson.feature(data, data.objects.rome_streets).features;

    //console.log(streets);

    // Create a path using the projection
    // a list of points becomes a path
    var path = d3.geoPath()
        .projection(projection);

    // Draw the streets
    svg.selectAll(".street")
        .data(streets)
        .enter()
        .append("path")
        .attr("class", "street")
        .attr("d", path);

    // console.log(streets);
});

// Load car crashes
d3.json("files/incidenti_stradali_sett_ott_2016.json", function(err, data) {
    if (err) return console.log(err);
    //console.log(data);

    var heatData = [];

    var crashesSpots = topojson.feature(data, data.objects.incidenti_stradali_sett_ott_2016).features;
    //console.log(crashesSpots);

    for (var i = 0; i < crashesSpots.length; i++) {
        var screenCoords = projection([crashesSpots[i].geometry.coordinates[0], crashesSpots[i].geometry.coordinates[1]]);
        heatData.push(new myHeatData(Math.floor(screenCoords[0]), Math.floor(screenCoords[1]), 1));
        //console.log(crashesSpots[i].properties);
        totalInjuried += crashesSpots[i].properties.NUM_FERITI;
        totalDeaths += crashesSpots[i].properties.NUM_MORTI;
    }

    console.log("total injuried: " + totalInjuried);
    console.log("total deaths: " + totalDeaths);

    // Top right angle text infos
    var totalDeathsText = "Totale morti: " + totalDeaths;
    var totalInjuriedText = "Totale feriti: " + totalInjuried;
    var uiTextData = [
        "Incidenti Stradali",
        "Settembre - Ottobre 2016",
        "Fonte: http://dati.comune.roma.it",
        ""
    ];

    svg.selectAll(".ui-text")
        .data(uiTextData)
        .enter()
        .append("text")
        .attr("class", "ui-text")
        .text(function(d, i) {
            return d;
        })
        .attr("x", width - 10)
        .attr("y", function(d, i) {
            return (i * 30) + 30;
        })
        .attr("text-anchor", "end");

    // add histogram bars
    var histogramData = [];
    histogramData.push(totalDeaths);
    histogramData.push(totalInjuried);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(histogramData)])
        .range([0, 300])
        .nice();

    svg.selectAll(".bar")
        .data(histogramData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", width - 280)
        .attr("y", function(d, i) {
            return 110 + (i * 30);
        })
        .attr("width", function(d) {
            return xScale(d);
        })
        .attr("height", 18)
        .attr("fill", "rgb(231, 77, 96)");

    // Labels
    svg.selectAll(".bar-text")
        .data(histogramData)
        .enter()
        .append("text")
        .attr("class", "bar-text")
        .text(function(d, i) {
            if (i == 0) return "Morti: " + d;
            if (i == 1) return "Feriti: " + d;
        })
        .attr("x", width - 350)
        .attr("y", function(d, i) {
            return 124 + (i * 30);
        });


    // heatmap
    var heatMaxValue = d3.max(heatData, function(d) {
        return d.value - 10;
    });

    heatmap.setData({
        max: heatMaxValue,
        data: heatData
    });

});

// Load rome transport hotspots
d3.json("files/rome_transport_hotspots.json", function(err, data) {
    if (err) return console.log(err);

    //console.log("rome transport hotspots data:");
    // console.log(data);
    var hotspots = topojson.feature(data, data.objects.rome_transport_hotspots).features;
    var hotspotRadius = 5;
    //console.log(hotspots);

    // Draw the hotspots
    svg.selectAll(".transport-hotspots")
        .data(hotspots)
        .enter()
        .append("circle")
        .attr("class", "transport-hotspots")
        .attr("r", hotspotRadius)
        .attr("cx", function(d) {
            // console.log(d.properties.Name);
            // console.log(d.geometry.coordinates);
            var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
            return coords[0];
        })
        .attr("cy", function(d) {
            var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
            return coords[1];
        })
        .on("mouseover", onTrasportHotspotMouseOver)
        .on("mouseout", function(d) {
            d3.select(this).classed("transport-hotspots-over", false);
        });
});

function onTrasportHotspotMouseOver(d) {
    d3.select(this).classed("transport-hotspots-over", true);
    currentHotspot = d.properties.Name;
    //console.log(currentHotspot);

    hotspotsArray.pop();
    hotspotsArray.push(currentHotspot);

    console.log(hotspotsArray);

    svg.select(".hotspot-text")
        .remove();

    // Add hotspots text
    svg.selectAll("hotspot-text")
        .data(hotspotsArray)
        .enter()
        .append("text")
        .attr("class", "hotspot-text")
        .text(currentHotspot)
        .attr("x", 40)
        .attr("y", 40);
}

// Load bus stops json
d3.json("files/rome_bus_stops.json", function(err, data) {
    if (err) return console.log(err);

    var romeBusStops = topojson.feature(data, data.objects.rome_bus_stops).features;

    var heatData = [];

    var test = dist(0, 0, 4, 4);
    //console.log("test: " + test);

    // for (var i = 0; i < 10; i++) {
    //     console.log(romeBusStops[i].geometry.coordinates);
    // }

    // Loop through stops to create heatmap
    for (var i = 0; i < romeBusStops.length; i++) {
        var screenCoords = projection([romeBusStops[i].geometry.coordinates[0], romeBusStops[i].geometry.coordinates[1]]);
        //var distanceFromCenter = dist(screenCoords[0], screenCoords[1], screenCenter[0], screenCenter[1]);
        //heatData.push(new myHeatData(Math.floor(screenCoords[0]), Math.floor(screenCoords[1]), 1));
        //console.log(distanceFromCenter);
    }
    // var heatMaxValue = d3.max(heatData, function(d) {
    //     return d.value - 10;
    // });
    if (DEBUG_HEATMAP) console.log("heatMaxValue: " + heatMaxValue);
    if (DEBUG_HEATMAP) console.log(heatData);

});
