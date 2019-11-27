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

var newDiameter = "3 in";
var newDepth = "0.5 in";

var getFeatures = async function(documentId, workspaceId, elementId) {
  let promise = new Promise((resolve, reject) => {
    client(apiKeyDetails).getFeatures(
      documentId,
      workspaceId,
      elementId,
      function(data) {
        resolve(data);
      }
    );
  });
  let data = await promise;
  return JSON.parse(data);
};

var updateFeatures = async function(documentId, workspaceId, elementId, body) {
  let promise = new Promise((resolve, reject) => {
    client(apiKeyDetails).updateFeatures(
      documentId,
      workspaceId,
      elementId,
      body,
      function(data) {
        resolve(data);
      }
    );
  });
  let data = await promise;
  return JSON.parse(data);
};

var apiFlow = async function(
  documentId,
  workspaceId,
  elementId,
  newDepth,
  newDiameter
) {
  var featureJson = await getFeatures(documentId, workspaceId, elementId);

  var sketchIndex = featureJson.features.findIndex(
    feature => feature.message.name == "SketchDiameter"
  );

  var extrudeIndex = featureJson.features.findIndex(
    feature => feature.message.name == "ExtrudeHeight"
  );

  featureJson.features[
    sketchIndex
  ].message.constraints[0].message.parameters[1].message.expression = newDiameter;

  featureJson.features[
    extrudeIndex
  ].message.parameters[9].message.expression = newDepth;

  var updated = await updateFeatures(
    documentId,
    workspaceId,
    elementId,
    featureJson
  );
  console.log(updated);
};

apiFlow(documentId, workspaceId, elementId, newDepth, newDiameter);
