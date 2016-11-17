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
console.log(workSheetsFromFile[0].data[0][0]); // Title
console.log(workSheetsFromFile[0].data[4][0]); // Subtitle
console.log("First 3 columns: " + workSheetsFromFile[0].data[6][1]); // First 3 columns
console.log("Last 3 columns: " + workSheetsFromFile[0].data[6][5]); // Last 3 columns
console.log(workSheetsFromFile[0].data[7]); // Last 3 columns

// Log first 4 actual rowsv
var startingRow = 9;
var lastRow = 12;
for(var i = startingRow; i < lastRow; i++){
  console.log(workSheetsFromFile[0].data[i]);
}
console.log(workSheetsFromFile[0].data[16]);
startingRow = 18;
lastRow = 31;
for(var i = startingRow; i < lastRow; i++){
  console.log(workSheetsFromFile[0].data[i]);
}
