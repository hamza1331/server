const express = require("express");
const router = express.Router();

const Info = require("./../models/globalInfo");
const DailyReport = require("./../models/addDailyReport");
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

router.get("/getDailyReportInfo", (req, res) => {
  // sizing current record nos
  Info.find({}, "dailyReport_info").exec(function(err, data) {
    if (err) {
        console.log("err", err);
      }
    res.json(data);
  });
});

router.get("/getDailyReportByRecordNo", (req, res) => {
  // gets sizing data by record Nos
  let record_no = req.query.record_no;
  // console.log('params / uprecord_no', record_no);
  DailyReport.findOne({ record_no: record_no }, (err, data) => {
    // console.log('data', data)
    if (err) {
      //manage error
      return;
    }
    res.json(data);
  });

  console.log("runned");
});

router.post("/addDailyReport", (req, res) => {
  // adds yarn Issue
  console.log("Add JJournals");

  console.log(req.body);
  const dailyReport = new DailyReport(req.body);
  Info.findByIdAndUpdate(
    "5d6a2eeef7935f12787d9cc6",
    {
      $inc: {
        dailyReport_info: 1
      }
    },
    (err, data) => {
      console.log("inc", err, data);
      dailyReport
        .save()
        .then(x => {
          res.json(x);
        })
        .catch(err => {
          console.log("err", err);
          res.status(500).send(err);
        });
    }
  );
});

router.post("/editDailyReport", (req, res) => {
  // edits beam Nos
  console.log(req.body);
  const { _id, arr } = req.body;
  DailyReport.findOne({ _id: _id }, function(err, data) {
    data.arr = arr;
    data.save();
    res.json(data);
  });
});

module.exports = router;
