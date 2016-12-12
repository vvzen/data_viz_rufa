// using https://github.com/mgcrea/node-xlsx to parse excel file
var xlsx = require("node-xlsx");
var fs = require("fs");

var fileName = "2015_tav1_01";
// parse the xls file
const workSheetsFromFile = xlsx.parse(`${__dirname}/` + fileName + ".xls");

// Write a json version of the file
//fs.writeFileSync("output/" + fileName + ".json", JSON.stringify(workSheetsFromFile));

// Still exploring the json tree
var sheetName = workSheetsFromFile[0].name;

console.log("Sheet name: " + sheetName);
console.log("Title" + workSheetsFromFile[0].data[0][0]); // Title
console.log("Subtitle" + workSheetsFromFile[0].data[4][0]); // Subtitle
console.log("First 3 columns: " + workSheetsFromFile[0].data[6][1]); // First 3 columns
console.log("Last 3 columns: " + workSheetsFromFile[0].data[6][5]); // Last 3 columns
console.log(workSheetsFromFile[0].data[7]); // Last 3 columns

// Save del totale incidenti
var startingRow = 9;
var lastRow = 12;
var contentToSave = [];
// Totale incidenti - di cui mortali
var currentColumns = workSheetsFromFile[0].data[7];
contentToSave.push(currentColumns);
for (var i = startingRow; i < lastRow; i++) {
    contentToSave.push(workSheetsFromFile[0].data[i]);
    console.log(workSheetsFromFile[0].data[i]);
}
// Save to file
var currentTitle = workSheetsFromFile[0].data[6][1];
fs.writeFileSync(currentTitle.toLowerCase().replace(/ /, "-") + ".json", JSON.stringify(contentToSave));

// Incidenti a veicoli isolati
console.log(workSheetsFromFile[0].data[16]);
startingRow = 18;
lastRow = 31;
for (var i = startingRow; i < lastRow; i++) {
    console.log(workSheetsFromFile[0].data[i]);
}
// Incidenti tra veicoli
console.log(workSheetsFromFile[0].data[32]);
startingRow = 34;
lastRow = 47;
for (var i = startingRow; i < lastRow; i++) {
    console.log(workSheetsFromFile[0].data[i]);
}
// Totale incidenti: per mese
