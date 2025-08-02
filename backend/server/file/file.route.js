//express
const express = require("express");
const route = express.Router();
const multer = require("multer");
//s3multer
const upload = require("../../util/s3multer");
const upload2 = multer({ dest: "uploads/" });
//checkAccessWithSecretKey
const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const FileController = require("./file.controller");

//upload content to digital ocean storage
route.post(
  "/upload-file",
  FileController.uploadContent,
  function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log("error in file ", error);
      } else {
        console.log("File uploaded successfully.");
        next();
      }
    });
  }
);

//delete upload content from digital ocean storage
route.delete(
  "/delete-upload",
  checkAccessWithSecretKey(),
  FileController.deleteUploadContent
);

module.exports = route;
