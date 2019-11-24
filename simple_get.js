var client = require("./onshape/apikey/lib/app");

require("dotenv").config();

var apiKeyDetails = {
  baseUrl: "https://cad.onshape.com",
  accessKey: process.env.ONSHAPE_ACCESS_KEY,
  secretKey: process.env.ONSHAPE_SECRET_KEY
};

client(apiKeyDetails).getDocuments({}, function(data) {
  console.log(data);
});
