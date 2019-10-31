const express = require("express");
const router = express.Router();

const Info = require("./../models/globalInfo");
const FabricIssue = require("./../models/addFabricIssue");
const Companies = require("./../models/AddCompanys");

router.get("/getLoomWeavers", (req, res) => {
  // sizing current record nos
  Companies.find({ bank_code: "2-1-3" }).exec(function(err, data) {
    if (err) {
      console.log("err", err);
    }
    res.json(data);
  });
});

router.get("/getFabricIssueInfo", (req, res) => {
  // sizing current record nos
  Info.find({}, "fabricIssue_info").exec(function(err, data) {
    if (err) {
        console.log("err", err);
      }
    res.json(data);
  
  });
});

router.get("/getFabricByRecordNo", (req, res) => {
  // gets sizing data by record Nos
  let record_no = req.query.record_no;
  // console.log('params / uprecord_no', record_no);
  FabricIssue.findOne({ record_no: record_no }, (err, data) => {
    // console.log('data', data)
    if (err) {
      //manage error
      return;
    }
    res.json(data);
  });

  console.log("runned");
});

router.post("/addFabricIssue", (req, res) => {
  // adds yarn Issue
  console.log("Add JJournals");

  console.log(req.body);
  const fabricIssue = new FabricIssue(req.body);
  Info.findByIdAndUpdate(
    "5d6a2eeef7935f12787d9cc6",
    {
      $inc: {
        fabricIssue_info: 1
      }
    },
    (err, data) => {
      console.log("inc", err, data);
      fabricIssue
        .save()
        .then(x => {
          res.json(x);
        })
        .catch(err => {
          console.log("err", err);
          res.status(500).send("err", err);
        });
    }
  );
});

router.post("/editFabricIssue", (req, res) => {
  // edits beam Nos
  console.log(req.body);
  const { _id, inner, outer } = req.body;
  FabricIssue.findOne({ _id: _id }, function(err, data) {
    data.inner = inner;
    data.outer = outer;
    data.save();
    res.json(data);
  });
});

module.exports = router;
