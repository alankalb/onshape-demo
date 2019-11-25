var client = require("./onshape/apikey/lib/app");

const fs = require("fs");
require("dotenv").config();

var apiKeyDetails = {
  baseUrl: "https://cad.onshape.com",
  accessKey: process.env.ONSHAPE_ACCESS_KEY,
  secretKey: process.env.ONSHAPE_SECRET_KEY
};

var documentId = "547e3732e044297245400441";
var workspaceId = "a4172eaa2592099428ac79c0";
var elementId = "397254c5d1fc59b540638ee2";

client(apiKeyDetails).getFeatures(documentId, workspaceId, elementId, function(
  data
) {
  writeFile(data);
});

async function writeFile(data) {
  fs.writeFile("onshape_features.json", data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("file was saved");
  });
}
