const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const Quality = require("../models/addQuality");
const YarnQuality = require("../models/addYarnQuality");



router.post("/addYarnQuality", (req, res) => {
  const qualities = new YarnQuality(req.body);
  console.log(qualities);
  qualities
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("err", err);
    });
});

router.get("/getYarnQuality", (req, res) => {
  YarnQuality.find({})
    .populate("quality")
    .exec(function(err, data) {
      if (err) {
        console.log("error", err);
        return;
      }
      res.json(data);
    });
});




router.post("/addQuality", (req, res) => {
  const qualities = new Quality(req.body);
  console.log(qualities);
  qualities
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("err", err);
    });
});

router.get("/getQuality", (req, res) => {
  Quality.find({})
    .exec(function(err, data) {
      if (err) {
        console.log("error", err);
        return;
      }
      res.json(data);
    });
});

module.exports = router;
