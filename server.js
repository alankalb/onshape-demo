var express = require("express");
var bodyParser = require("body-parser");

const app = express();
const port = 3000;

var client = require("./onshape/apikey/lib/app");
require("dotenv").config();

app.use(bodyParser.json());

app.get("/", (req, res) => res.sendFile(__dirname + "/home.html"));

app.get("/current_state", function(req, res) {
  var apiKeyDetails = {
    baseUrl: "https://cad.onshape.com",
    accessKey: process.env.ONSHAPE_ACCESS_KEY,
    secretKey: process.env.ONSHAPE_SECRET_KEY
  };

  var documentId = "547e3732e044297245400441";
  var workspaceId = "a4172eaa2592099428ac79c0";
  var elementId = "397254c5d1fc59b540638ee2";

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

  var getShadedView = async function(documentId, workspaceId, elementId) {
    let promise = new Promise((resolve, reject) => {
      client(apiKeyDetails).getShadedViews(
        documentId,
        workspaceId,
        elementId,
        function(data) {
          resolve(data);
        },
        function(error) {
          console.log(error);
          reject(error);
        }
      );
    });
    let data = await promise;
    return JSON.parse(data);
  };

  var apiFlow = async function(documentId, workspaceId, elementId) {
    var featureJson = await getFeatures(documentId, workspaceId, elementId);

    var sketchIndex = featureJson.features.findIndex(
      feature => feature.message.name == "SketchDiameter"
    );

    var extrudeIndex = featureJson.features.findIndex(
      feature => feature.message.name == "ExtrudeHeight"
    );

    var diameter =
      featureJson.features[sketchIndex].message.constraints[0].message
        .parameters[1].message.expression;

    var depth =
      featureJson.features[extrudeIndex].message.parameters[9].message
        .expression;

    var shadedView = await getShadedView(documentId, workspaceId, elementId);

    res.json({ depth: depth, diameter: diameter, image: shadedView.images[0] });
  };

  apiFlow(documentId, workspaceId, elementId);
});

app.put("/update", function(req, res) {
  var dimensions = req.body;

  var apiKeyDetails = {
    baseUrl: "https://cad.onshape.com",
    accessKey: process.env.ONSHAPE_ACCESS_KEY,
    secretKey: process.env.ONSHAPE_SECRET_KEY
  };

  var documentId = "547e3732e044297245400441";
  var workspaceId = "a4172eaa2592099428ac79c0";
  var elementId = "397254c5d1fc59b540638ee2";

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

  var getShadedView = async function(documentId, workspaceId, elementId) {
    let promise = new Promise((resolve, reject) => {
      client(apiKeyDetails).getShadedViews(
        documentId,
        workspaceId,
        elementId,
        function(data) {
          resolve(data);
        },
        function(error) {
          console.log(error);
          reject(error);
        }
      );
    });
    let data = await promise;
    return JSON.parse(data);
  };

  var updateFeatures = async function(
    documentId,
    workspaceId,
    elementId,
    body
  ) {
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

    await updateFeatures(documentId, workspaceId, elementId, featureJson);

    var shadedView = await getShadedView(documentId, workspaceId, elementId);
    res.json({ image: shadedView.images[0] });
  };

  apiFlow(
    documentId,
    workspaceId,
    elementId,
    dimensions.depth,
    dimensions.diameter
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
