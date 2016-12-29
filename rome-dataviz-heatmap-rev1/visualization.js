// DEBUG vars
var DEBUG_HEATMAP = false;

// Global vars
var width = window.innerWidth;
var height = window.innerHeight;
// var width = screen.width;
// var height = screen.height;
var currentHotspot;
var hotspotsArray = [];
var zonesArray = [];
var currentZonePolygon;
// topojson feature obj
var crashesSpots;
var totalInjuried = 0;
var totalDeaths = 0;
var totalWomenCrashes = 0;
var totalMenCrashes = 0;

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
console.log("Creating svg.. width: " + width + ", height: " + height);
var svg = d3.select("body")
    .append("svg")
    .attr("id", "svg-container")
    .attr("width", width)
    .attr("height", height);

// HEATMAP
var purpleGradient = {
    '.01': 'rgba(255, 231, 255, 0)',
    '.03': 'rgba(205, 37, 188, 0.65)',
    '.99': 'rgb(247, 19, 169)'
}
var yellowGradient = {
    '.01': 'rgba(255, 255, 255, 0)',
    '.03': 'rgba(242, 118, 17, 0.91)',
    '.99': 'rgb(227, 191, 39)'
}
var blueGradient = {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '.7': 'rgb(43, 227, 188)',
    '.99': 'rgb(36, 51, 254)'
};
// init heatmaps
// injuried
var injuriedHeatmapConfig = {
    container: document.getElementById('heatmapContainer'),
    radius: 8,
    maxOpacity: .6,
    minOpacity: 0,
    blur: .99,
    gradient: purpleGradient
};
// deaths
var deathsHeatmapConfig = {
    container: document.getElementById('heatmapContainer'),
    radius: 12,
    maxOpacity: .99,
    minOpacity: 0,
    blur: .5,
    gradient: yellowGradient
};

var injuriedHeatmap = h337.create(injuriedHeatmapConfig);
var deathsHeatmap = h337.create(deathsHeatmapConfig);

// used to add new element to injuriedHeatmap
function myHeatData(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
}

// Rome center: lon, lat
var mapCenter = [12.5102487, 41.8931614];

var projection = d3.geoMercator()
    .scale(170000)
    .center(mapCenter)
    .translate([width / 2, height / 2]);

// get screen center in screen space coordinates
var screenCenter = projection([mapCenter[0], mapCenter[1]]);
console.log("screenCenter: " + screenCenter[0] + ", " + screenCenter[1]);

// Object for storing zones name and points in xy coordinates space
function zonePolygon(name, points) {
    this.name = name;
    var xyConvertedPoints = [];
    // console.log("Creating zone polygon");
    for (var i = 0; i < points.length; i++) {
        //console.log(points[i]);
        for (var p = 0; p < points[i].length; p++) {
            var currentPoint = points[i][p];
            var convertedPoint = projection([currentPoint[0], currentPoint[1]]);
            //console.log("current point: " + currentPoint[0] + ", " + currentPoint[1]);
            //console.log("converted point: " + convertedPoint[0] + ", " + convertedPoint[1]);
            xyConvertedPoints.push(convertedPoint);
        }
    }

    this.points = xyConvertedPoints;
}

// Load zones data
d3.json("files/rome_zone_urbanistiche_GRA.json", function(err, data) {
    if (err) return console.log(err);

    var zones = topojson.feature(data, data.objects.rome_zone_urbanistiche_GRA).features;
    //console.log(zones);

    var path = d3.geoPath()
        .projection(projection);

    // svg.selectAll(".zone")
    //     .data(zones)
    //     .enter()
    //     .append("path")
    //     .attr("class", "zone")
    //     .attr("d", path)
    //     .on("mouseover", onZonesMouseOver)
    //     .on("mouseout", function(d, i) {
    //         d3.select(this).classed("zone-hover", false);
    //     });

    svg.selectAll(".zone")
        .data(zones)
        .enter()
        .append("path")
        .attr("class", "zone")
        .attr("d", path)
        .on("mouseover", onZonesMouseOver)
        .on("mouseout", function(d, i) {
            d3.select(this).classed("zone-hover", false);
        });

});

function onZonesMouseOver(d, i) {

    d3.select(this).classed("zone-hover", true);

    var currentZoneName = d.properties.DEN_Z_URB;
    //console.log(currentHotspot);

    zonesArray.pop();
    zonesArray.push(currentZoneName);

    svg.select(".hotspot-text")
        .remove();

    // Add zone name on top right angle
    svg.selectAll("hotspot-text")
        .data(zonesArray)
        .enter()
        .append("text")
        .attr("class", "hotspot-text")
        .text(currentZoneName)
        .attr("x", width - 40)
        .attr("y", 40)
        .attr("text-anchor", "end");

    // 1. get polygon for current zone
    currentZonePolygon = new zonePolygon(currentZoneName, d.geometry.coordinates);

    // 2. check which crashes are inside current polygon
    var totalDeathsInZone = 0;
    var totalInjuriedInZone = 0;
    for (var c = 0; c < 100; c++) {
        var crashCoordinates = [crashesSpots[c].geometry.coordinates[0], crashesSpots[c].geometry.coordinates[1]];
        var screenCrashCoordinates = projection([crashCoordinates[0], crashCoordinates[1]]);
        //console.log(screenCrashCoordinates);
        //console.log(screenCrashCoordinates);
        //console.log(d3.polygonContains(currentZonePolygon.points, screenCrashCoordinates));
        if (d3.polygonContains(currentZonePolygon.points, screenCrashCoordinates)) {
            // track deaths
            if (crashesSpots[c].properties.Deceduto === -1) {
                totalDeathsInZone++;
            }
            // track injuries
            // progressivo is 1 for single crashes, and is 2,3,4+ for crashes shared by different cars
            if (crashesSpots[c].properties.Progressiv === 1) {
                totalInjuriedInZone += crashesSpots[i].properties.NUM_FERITI;
            }
        }
    }

    console.log("total deaths in zone: " + totalDeathsInZone);
    console.log("total injuried in zone: " + totalInjuriedInZone);

    var histogramData = [];
    histogramData.push(totalDeathsInZone);
    histogramData.push(totalInjuriedInZone);

    // 3. update histogram bars
    var yBarPadding = 70;

    // draw the histogram bars
    drawHistogram(histogramData);
}

function drawHistogram(data) {

    var barHeight = 20;
    var barPadding = 4;
    var barCoordinates = [width - 400, 100];

    // var deathsBar = svg.append("rect")
    //     .attr("class", "bar-deaths")
    //     .attr("x", deathBarCoordinates[0])
    //     .attr("y", deathBarCoordinates[1])
    //     .attr("width", 10)
    //     .attr("height", barHeight);
    //
    // var injuriedBar = svg.append("rect")
    //     .attr("class", "bar-injuried")
    //     .attr("x", injuriedBarCoordinates[0])
    //     .attr("y", injuriedBarCoordinates[1])
    //     .attr("width", 10)
    //     .attr("height", barHeight);

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return barCoordinates[0];
        })
        .attr("y", function(d, i) {
            return barCoordinates[1] + (i * (barHeight + 5));
        })
        .attr("width", function(d) {
            return 10 + d;
        })
        .attr("height", function(d) {
            return barHeight;
        });
}

// Load streets data
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

    var injuriedHeatData = [];
    var deathsHeatData = [];

    crashesSpots = topojson.feature(data, data.objects.incidenti_stradali_sett_ott_2016).features;
    //console.log(crashesSpots);

    // Loop through crashes spots
    for (var i = 0; i < crashesSpots.length; i++) {
        var screenCoords = projection([crashesSpots[i].geometry.coordinates[0], crashesSpots[i].geometry.coordinates[1]]);
        injuriedHeatData.push(new myHeatData(Math.floor(screenCoords[0]), Math.floor(screenCoords[1]), 1));
        // track deaths
        if (crashesSpots[i].properties.Deceduto === -1) {
            //console.log("death event:");
            //console.log(crashesSpots[i].properties);
            deathsHeatData.push(new myHeatData(Math.floor(screenCoords[0]), Math.floor(screenCoords[1]), 1));
            totalDeaths++;
        }
        // track injuries
        // progressivo is 1 for single crashes, and is 2,3,4+ for crashes shared by different cars
        if (crashesSpots[i].properties.Progressiv === 1) {
            totalInjuried += crashesSpots[i].properties.NUM_FERITI;
        }
        // keep track of gender
        if (crashesSpots[i].properties.Sesso === "M") {
            totalMenCrashes++;
        } else if (crashesSpots[i].properties.Sesso === "F") {
            totalWomenCrashes++;
        }

    }

    // console.log("total injuried: " + totalInjuried);
    // console.log("total deaths: " + totalDeaths);
    //
    // console.log("men: " + totalMenCrashes);
    // console.log("women: " + totalWomenCrashes);
    //
    // console.log("deathsHeatData length: " + deathsHeatData.length);
    // console.log(deathsHeatData);

    // Top right angle text infos
    var totalDeathsText = "Totale morti: " + totalDeaths;
    var totalInjuriedText = "Totale feriti: " + totalInjuried;
    var uiTextData = [
        "INCIDENTI STRADALI",
        "ROMA",
        "Settembre/Ottobre 2016"
    ];
    // var uiTextData = [
    //     "INCIDENTI STRADALI",
    //     "Settembre - Ottobre 2016",
    //     "Fonte: http://dati.comune.roma.it",
    //     ""
    // ];

    // top left info
    svg.selectAll(".ui-text")
        .data(uiTextData)
        .enter()
        .append("text")
        .attr("class", "ui-text")
        .text(function(d, i) {
            return d;
        })
        .attr("x", function(d, i) {
            if (i == 2) return 30;
            return 10;
        })
        .attr("y", function(d, i) {
            return (i * 30) + 40;
        })
        .attr("fill", function(d, i) {
            if (i == 1) d3.select(this).classed("ui-text-city", true);
        })
        .attr("text-anchor", "start");

    /** DEBUGGING
        // add histogram bars
        var histogramData = [];
        histogramData.push(totalDeaths);
        histogramData.push(totalInjuried);

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(histogramData)])
            .range([0, 300])
            .nice();

        var yBarPadding = 70;

        // draw the histogram bars
        var barX = width - 310;
        svg.selectAll(".bar")
            .data(histogramData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", barX)
            .attr("y", function(d, i) {
                return yBarPadding + (i * 30);
            })
            .attr("width", function(d) {
                return xScale(d);
            })
            .attr("height", 18)
            .attr("class", function(d, i) {
                if (i == 0) return "bar-deaths";
                if (i == 1) return "bar-injuried";
            });

        // draw text on the bars
        svg.selectAll(".bar-text")
            .data(histogramData)
            .enter()
            .append("text")
            .attr("class", "bar-text")
            .text(function(d, i) {
                if (i == 0) return "Morti: " + d;
                if (i == 1) return "Feriti: " + d;
            })
            .attr("x", barX - 10)
            .attr("y", function(d, i) {
                return yBarPadding + 14 + (i * 30);
            })
            .attr("text-anchor", "end");

            */

    // draw the heatmaps
    injuriedHeatmap.setData({
        max: 6,
        data: injuriedHeatData
    });

    deathsHeatmap.setData({
        max: 1.2,
        data: deathsHeatData
    });

});

// Load rome transport hotspots
/**
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
*/

// Update top right UI on transport hotspot mouse over
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
        .attr("x", width - 40)
        .attr("y", 40)
        .attr("text-anchor", "end");
}

// Load bus stops json
// d3.json("files/rome_bus_stops.json", function(err, data) {
//     if (err) return console.log(err);
//
//     var romeBusStops = topojson.feature(data, data.objects.rome_bus_stops).features;
//
//     var heatData = [];
//
//     var test = dist(0, 0, 4, 4);
//     //console.log("test: " + test);
//
//     // for (var i = 0; i < 10; i++) {
//     //     console.log(romeBusStops[i].geometry.coordinates);
//     // }
//
//     // Loop through stops to create injuriedHeatmap
//     for (var i = 0; i < romeBusStops.length; i++) {
//         var screenCoords = projection([romeBusStops[i].geometry.coordinates[0], romeBusStops[i].geometry.coordinates[1]]);
//         //var distanceFromCenter = dist(screenCoords[0], screenCoords[1], screenCenter[0], screenCenter[1]);
//         //heatData.push(new myHeatData(Math.floor(screenCoords[0]), Math.floor(screenCoords[1]), 1));
//         //console.log(distanceFromCenter);
//     }
//     // var heatMaxValue = d3.max(heatData, function(d) {
//     //     return d.value - 10;
//     // });
//     if (DEBUG_HEATMAP) console.log("heatMaxValue: " + heatMaxValue);
//     if (DEBUG_HEATMAP) console.log(heatData);
//
// });
