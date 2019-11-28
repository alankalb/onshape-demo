var express = require("express");
var bodyParser = require("body-parser");

const app = express();
const port = 3000;

var client = require("./onshape/apikey/lib/app");
require("dotenv").config();

app.use(bodyParser.json());

app.post("/", function(req, res) {
  console.log(req.body.line_items[0].properties[0].value);
  var newName = req.body.line_items[0].properties[0].value;

  var apiKeyDetails = {
    baseUrl: "https://cad.onshape.com",
    accessKey: process.env.ONSHAPE_ACCESS_KEY,
    secretKey: process.env.ONSHAPE_SECRET_KEY
  };

  var documentId = "f2910d2e384728609451b6d4";
  var workspaceId = "ede67d047789d346e4e7bcb1";
  var elementId = "3f60d394c884d788cde8d995";

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
    return data;
  };

  var apiFlow = async function(documentId, workspaceId, elementId, newName) {
    var featureJson = await getFeatures(documentId, workspaceId, elementId);

    featureJson.features[1].message.parameters[22].message.expression =
      (newName.length - 4) * 0.65 + 1 + " in";

    var nameIndex = featureJson.features.findIndex(
      feature => feature.message.name == "NameText"
    );

    featureJson.features[
      nameIndex
    ].message.entities[0].message.parameters[1].message.value = newName.toUpperCase();

    updateFeatures(documentId, workspaceId, elementId, featureJson);
    console.log("update sent");
  };

  apiFlow(documentId, workspaceId, elementId, newName);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
