const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const Quality = require("./../models/addQuality");
const YarnQuality = require("./../models/addyarnQuality");
const FabricQuality = require("./../models/addFabricQuality");
const Brand = require("./../models/addbrand");
const Info = require('./../models/globalInfo')



router.get('/getYarnIssueInfo', (req, res) => {
    Info.find({}, 'yarnIssue_info').exec(function (err, data) {
        console.log('data', data)
        res.json(data);
        if (err) {
            console.log('err', err)
        };
    });
})


router.post("/addFabricQuality", (req, res) => {
  const fabricQuality = new FabricQuality(req.body);
  fabricQuality.save().then(data => {
    res.json(data);
  }).catch(err => {
    console.log('err', err)
  })
})

router.get("/getFabricQuality", (req, res) => {
  FabricQuality.find({})
  .populate({ path: 'warp_count', populate: { path: 'quality' }})
  .populate({ path: 'weft_count', populate: { path: 'quality' }})
  .exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});


router.post('/editFabricQuality', (req, res) => {
    console.log(req.body)
    const { _id, warp_count, weft_count, ends, picks, width } = req.body;
    FabricQuality.findOne({ _id: _id }, function (err, data) {
        data.warp_count = warp_count;
        data.weft_count = weft_count;
        data.ends = ends;
        data.picks = picks;
        data.width = width;
        data.save();
        res.json(data);
    });
})



router.post('/editBrand', (req, res) => {
    console.log(req.body)
    const { _id, brand } = req.body;
    Brand.findOne({ _id: _id }, function (err, data) {
        data.brand = brand;
        data.save();
        res.json(data);
    });
})



router.post('/editQuality', (req, res) => {
    console.log(req.body)
    const { _id, quality } = req.body;
    Quality.findOne({ _id: _id }, function (err, data) {
        data.quality = quality;
        data.save();
        res.json(data);
    });
})


router.post('/editYarnQuality', (req, res) => {
    console.log(req.body)
    const { _id, yarn_count, s_d } = req.body;
    YarnQuality.findOne({ _id: _id }, function (err, data) {
        data.yarn_count = yarn_count;
        data.s_d   = s_d ;
        data.save();
        res.json(data);
    });
})


router.post("/addYarnQuality", (req, res) => {
  const qualities = new YarnQuality(req.body);
  console.log(qualities);
  // YarnQuality.findOne({ quality: req.body.quality }, (error, data) => {
    // if (data) {
    //   res.json("Quality is already");
    //   return
    // }

    qualities
      .save()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.log("err", err);
      });
  // });

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
  console.log('ok',qualities);
  Quality.findOne({ quality: req.body.quality }, (error, data) => {
    if (data) {
      res.json("Quality is already");
      return
    }
  qualities
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("err", err);
    });
  });
});

router.get("/getBrand", (req, res) => {
  Brand.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

router.post("/addBrand", (req, res) => {
  const brands = new Brand(req.body);
  console.log('ok',brands);
  Brand.findOne({ brand: req.body.brand }, (error, data) => {
    if (data) {
      res.json("Quality is already");
      return
    }
  brands
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("err", err);
    });
  });
});

router.get("/getQuality", (req, res) => {
  Quality.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

module.exports = router;
