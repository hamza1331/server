const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const Quality = require("./../models/addQuality");
const YarnQuality = require("./../models/addyarnQuality");
const FabricQuality = require("./../models/addFabricQuality");
const Brand = require("./../models/addbrand");
const Unit = require("./../models/addUnit");
const Info = require("./../models/globalInfo");
const YarnIssue = require("./../models/addYarnIssue");
const BeamIssue = require("./../models/addBeamIssue");
const AddSizings = require("./../models/addSizing");
const Companies = require("../models/AddCompanys");

router.get("/getSizingDataforBeamIssue", (req, res) => {
  // filter data for beam issue
  let arr = [];
  AddSizings.find({})
    .populate([{ path: "count", populate: { path: "quality" } }])
    .exec(function(err, data) {
      if (err) {
        return;
      }
      data.map(x => {
        x.count &&
          arr.push({
            quality: x.count,
            _id: x._id,
            type: x.type,
            ends: x.ends,
            beamArr: x.beamArr,
            yarn_issue_id: x.yarn_issue_id,
            twisted: x.twists
          });
      });
      res.json(arr);
    });
});

router.get("/getSizingCount", (req, res) => {
  // filter data for beam issue
  let { _id } = req.query;
  console.log("++++++++++=============++++++++++++++");
  let arr = [];
  let final_Arr = [];
  YarnIssue.find({})
    .populate([
      { path: "outer.count", populate: { path: "quality" } },
      { path: "outer.chartOfAccounts", populate: { path: "bank_id" } }
    ])
    .exec(function(err, data) {
      if (err) {
        return;
      }

      data.forEach(v => {
        v.outer.map(x => {
          // console.log(x.typeOuter === "Warping", x.chartOfAccounts);
          if (x.typeOuter === "Warping" && x.chartOfAccounts._id == _id) {
            arr.push(x);
          }
        });
      });

      AddSizings.find({})
        .populate([
          { path: "count", populate: { path: "quality" } },
          { path: "chartOfAccounts", populate: { path: "bank_id" } }
        ])
        .exec(function(err, data) {
          if (err) {
            return;
          }

          arr.map((v, i) => {
            let issued = 0;
            data.map((x) => {
              if (
                v.count.yarn_count == x.count.yarn_count &&
                v.chartOfAccounts.company_code == x.chartOfAccounts.company_code
              ) {
                issued += parseInt(x.beam_lbs ? Math.abs(x.beam_lbs): 0);
                console.log(issued, x.beam_lbs, 'op');
                let obj = arr[i];
                obj_main = {
                  ...obj,
                  issued: Math.abs(issued)
                };
                let xoxo = { ...(obj_main["_doc"] ? obj_main["_doc"]: obj_main), issued: obj_main.issued };
                arr[i] = xoxo;
                }
            });
          });

          res.json(arr.filter(v => v.issued !== undefined)) && console.log("opop");
          console.log("++++++++++=============++++++++++++++");
        });
      // console.log(arr[0].issued)
    });
});

router.get("/getYarnIsue_sizing", (req, res) => {
  // get beam issue outer items if its typeOuter value is 'warping' for beam issues count
  let arr = [];
  let yarnId = [];
  YarnIssue.find({})
    .populate([
      { path: "outer.count", populate: { path: "quality" } },
      { path: "inner.count", populate: { path: "quality" } }
    ])
    .exec(function(err, data) {
      if (err) {
        return;
      }
      data.forEach(v => {
        v.inner.map(x => {
          if (x.type === "Twisted" && x.twisted !== undefined) {
            x.count &&
              arr.push({
                x,
                no_of_cartons: x.no_of_cartons,
                total_weight: x.total_weight,
                quality: x.count,
                _id: v._id,
                type: x.typeOuter,
                record_no: v.record_no,
                twisted: x.twisted,
                type_1: "inner"
              });
            yarnId.push(
              x.count.quality.quality +
                "/" +
                x.count.yarn_count +
                "/" +
                x.twisted
            );
          }
        });
        v.outer.map(x => {
          if (x.typeOuter === "Twist" && x.twisted !== undefined) {
            x.count &&
              arr.push({
                x,
                no_of_cartons: x.no_of_cartons,
                total_weight: x.total_weight,
                quality: x.count,
                _id: v._id,
                type: x.typeOuter,
                record_no: v.record_no,
                twisted: x.twisted,
                type_1: "outer"
              }) &&
              yarnId.push(
                x.count.quality.quality +
                  "/" +
                  x.count.yarn_count +
                  "/" +
                  x.twisted
              );
          }
        });
      });

      let final_yarn = [];
      var deduped = yarnId.filter(function(sandwich, index) {
        return yarnId.indexOf(sandwich) === index;
      });

      console.log(deduped);

      deduped
        .sort((a, b) => (a > b ? 1 : -1))
        .map((v, e) => {
          let issued = 0;
          let recieved = 0;
          let issued_kg = 0;
          let recieved_kg = 0;
          arr
            .sort((a, b) =>
              a.quality.quality + "/" + a.yarn_count + "/" + a.twisted >
              b.quality.quality + "/" + b.yarn_count + "/" + b.twisted
                ? 1
                : -1
            )
            .map((w, i) => {
              if (
                i === 0 &&
                v ===
                  w.quality.quality.quality +
                    "/" +
                    w.quality.yarn_count +
                    "/" +
                    w.twisted
              ) {
                if (w.type_1 === "outer") {
                  issued += w.no_of_cartons;
                  issued_kg += w.total_weight;
                } else {
                  recieved += w.no_of_cartons;
                  recieved_kg += w.total_weight;
                }
                console.log("first");
              }

              if (
                i !== 0 &&
                v ===
                  w.quality.quality.quality +
                    "/" +
                    w.quality.yarn_count +
                    "/" +
                    w.twisted
              ) {
                if (w.type_1 === "outer") {
                  issued += w.no_of_cartons;
                  issued_kg += w.total_weight;
                } else {
                  recieved += w.no_of_cartons;
                  recieved_kg += w.total_weight;
                }
              }
              if (
                i !== 0 &&
                v ===
                  w.quality.quality.quality +
                    "/" +
                    w.quality.yarn_count +
                    "/" +
                    w.twisted &&
                arr[i - 1].quality.quality.quality +
                  "/" +
                  w.quality.yarn_count +
                  "/" +
                  w.twisted ===
                  w.quality.quality.quality +
                    "/" +
                    w.quality.yarn_count +
                    "/" +
                    w.twisted
              ) {
                arr[i].issued = issued;
                arr[i].recieved = recieved;
                arr[i].issued_kg = issued_kg;
                arr[i].recieved_kg = recieved_kg;
                console.log(recieved_kg, issued_kg);
                final_yarn.push(arr[i]);
                return;
              }
            });
        });

      // yarnId.map(a => {
      //   console.log(a)
      // })

      // arr.map(a => {
      //   console.log(a.quality._id)
      // })

      console.log(final_yarn.length);
      res.json(final_yarn);
    });
});

// router.get("/getYarnIsue_sizing", (req, res) => {
//   // get beam issue outer items if its typeOuter value is 'warping' for beam issues count
//   let arr = [];
//   YarnIssue.find({})
//     .populate({ path: "outer.count", populate: { path: "quality" } })
//     .exec(function(err, data) {
//       if (err) {
//         return;
//       }
//       data.forEach(v => {
//         v.outer.map(x => {
//           if (x.typeOuter === "Twist") {
//             x.count &&
//               arr.push({
//                 x,
//                 no_of_cartons: x.no_of_cartons,
//                 total_weight: x.total_weight,
//                 quality: x.count,
//                 _id: v._id,
//                 type: x.typeOuter,
//                 record_no: v.record_no,
//                 twisted: x.twisted,
//
//               });
//           }
//         });
//       });
//       res.json(arr);
//     });
// });

router.get("/getYarnRecieve_twisted", (req, res) => {
  // get beam issue outer items if its typeOuter value is 'warping' for beam issues count
  let arr = [];
  YarnIssue.find({})
    .populate({ path: "inner.count", populate: { path: "quality" } })
    .exec(function(err, data) {
      if (err) {
        return;
      }
      data.forEach(v => {
        v.inner.map(x => {
          if (x.type === "Twisted") {
            x.count &&
              arr.push({
                quality: x.count,
                _id: v._id,
                type: x.typeOuter,
                record_no: v.record_no,
                twisted: x.twisted
              });
          }
        });
      });
      res.json(arr);
    });
});

router.get("/getYarnIsue_sizing_warping", (req, res) => {
  // get beam issue outer items if its typeOuter value is 'warping' for beam issues count
  let arr = [];
  YarnIssue.find({})
    .populate({ path: "outer.count", populate: { path: "quality" } })
    .exec(function(err, data) {
      if (err) {
        return;
      }
      data.forEach(v => {
        v.outer.map(x => {
          if (x.typeOuter === "Warping") {
            x.count &&
              arr.push({
                quality: x.count,
                _id: v._id,
                type: x.typeOuter,
                record_no: v.record_no,
                twisted: x.twisted
              });
          }
        });
      });
      res.json(arr);
    });
});

router.get("/getCompanies_sizing", (req, res) => {
  // get companies data
  Companies.find({}).exec(function(err, data) {
    // console.log("bank_id", data, err);
    let data_arr = [];
    let response = data.map(v => {
      if (v.bank_code === "1-1-1" || v.bank_code === "2-1-1") {
        data_arr.push(v);
      }
    });
    res.json(data_arr);
  });
});

router.get("/getSizingInfo", (req, res) => {
  // sizing current record nos
  Info.find({}, "sizing_info").exec(function(err, data) {
    res.json(data);
    if (err) {
      console.log("err", err);
    }
  });
});

router.get("/getSizing", (req, res) => {
  // sizing form datas
  AddSizings.find({}, (err, data) => {
    if (err) {
      return;
    }
    res.json(data);
  });
});

router.post("/editSizing", (req, res) => {
  // editing size datas
  console.log(req.body);
  const {
    _id,
    chartOfAccounts,
    head_of_ac,
    set_no,
    count,
    ends,
    beam_length_yard,
    beam_length_meter,
    beam_lbs,
    sizing_rate,
    amount,
    gst,
    gst_total_amount,
    beamArr
  } = req.body;
  AddSizings.findOne({ _id: _id }, function(err, data) {
    data.chartOfAccounts = chartOfAccounts;
    data.head_of_ac = head_of_ac;
    data.set_no = set_no;
    data.count = count;
    data.ends = ends;
    data.beam_length_meter = beam_length_meter;
    data.beam_length_yard = beam_length_yard;
    data.beam_lbs = beam_lbs;
    data.sizing_rate = sizing_rate;
    data.amount = amount;
    data.gst = gst;
    data.gst_total_amount = gst_total_amount;
    data.beamArr = beamArr;
    data.save();
    res.json(data);
  });
});

router.get("/getSizingByRecordNo", (req, res) => {
  // gets sizing data by record Nos
  let record_no = req.query.record_no;
  // console.log('params / uprecord_no', record_no);
  AddSizings.findOne({ record_no: record_no }, (err, data) => {
    // console.log('data', data)
    if (err) {
      //manage error
      return;
    }
    res.json(data);
  });

  console.log("runned");
});

router.post("/addSizings", (req, res) => {
  // adds Sizisngs
  const sizing = new AddSizings(req.body);
  console.log(sizing);

  Info.findByIdAndUpdate(
    "5d6a2eeef7935f12787d9cc6",
    {
      $inc: {
        sizing_info: 1
      }
    },
    (err, data) => {
      console.log("inc", err, data);
      if (err) {
        return;
      }
      sizing
        .save()
        .then(x => {
          res.json(x);
        })
        .catch(error => {
          console.log("err", error);
          res.status(500).send(error);
        });
    }
  );
});

router.get("/getBeamIssueInfo", (req, res) => {
  // get beamIssue current record no
  Info.find({}, "beamIssue_info").exec(function(err, data) {
    console.log("data", data);
    res.json(data);
    if (err) {
      console.log("err", err);
    }
  });
});

router.post("/editBeamIssue", (req, res) => {
  // edits beam Nos
  console.log(req.body);
  const {
    _id,
    chartOfAccounts,
    head_of_ac,
    set_no,
    count,
    ends,
    fabric_quality,
    beam_length_yard,
    beam_length_meter,
    beam_lbs,
    beam_no
  } = req.body;
  BeamIssue.findOne({ _id: _id }, function(err, data) {
    data.head_of_ac = head_of_ac;
    data.count = count;
    data.ends = ends;
    data.beam_length_meter = beam_length_meter;
    data.beam_length_yard = beam_length_yard;
    data.beam_lbs = beam_lbs;
    data.beam_no = beam_no;
    data.fabric_quality = fabric_quality;
    data.save();
    res.json(data);
  });
});

router.get("/getBeamIssueByRecordNo", (req, res) => {
  // gets beam Issue by recordNos
  let record_no = req.query.record_no;
  // console.log('params / uprecord_no', record_no);

  BeamIssue.findOne({ record_no: record_no }, (err, data) => {
    console.log("data", data);
    if (err) {
      //manage error
      return;
    }
    res.json(data);
  });

  console.log("runned");
});

router.get("/getBeamIssues", (req, res) => {
  // gets all beam Issues
  BeamIssue.find({}, (err, data) => {
    console.log("data", data);
    if (err) {
      return;
    }
    res.json(data);
  });
});

router.get("/getYarnIssue_outer", (req, res) => {
  // get beam issue outer items if its typeOuter value is 'warping' for beam issues count
  let arr = [];
  YarnIssue.find({ "outer.typeOuter": "Warping" })
    .populate({ path: "outer.count", populate: { path: "quality" } })
    .exec(function(err, data) {
      if (err) {
        return;
      }

      data.forEach(v => {
        v.outer.map(x => {
          if (x.typeOuter === "Warping") {
            arr.push(x);
          }
        });
      });
      res.json(arr);
    });
});

router.post("/addBeamIssue", (req, res) => {
  // adds beam issue
  console.log(req.body);
  let beamArr = [];
  req.body.beamArr.map(v => {
    if (v.checked) {
      AddSizings.findOne({ _id: req.body.count_id }).exec(function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(data);
        let arr = [];
        data.beamArr.map(val => {
          console.log(val._id, v._id);
          if (val._id != v._id) {
            arr.push(val);
            // data.remove()
          }
        });
        data.beamArr = arr;
        data.save();
      });
      beamArr.push(v);
    }
  });

  let obj = req.body;
  obj.beamArr = beamArr;
  const beamIssue = new BeamIssue(obj);
  Info.findByIdAndUpdate(
    "5d6a2eeef7935f12787d9cc6",
    {
      $inc: {
        beamIssue_info: 1
      }
    },
    (err, data) => {
      // console.log("inc", err, data);
      if (err) {
        return;
      }
      beamIssue
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

router.get("/getYarnIssueByRecordNo", (req, res) => {
  // get yarn Issue by record nos
  let record_no = req.query.record_no;
  console.log("params / uprecord_no", record_no);

  YarnIssue.findOne({ record_no: record_no }, (err, data) => {
    console.log("data", data);
    if (err) {
      //manage error
      return;
    }
    res.json(data);
  });

  console.log("runned");
});

router.post("/editYarnIssue", (req, res) => {
  // edits beam Nos
  console.log(req.body);
  const { _id, inner, outer } = req.body;
  YarnIssue.findOne({ _id: _id }, function(err, data) {
    data.inner = inner;
    data.outer = outer;
    data.save();
    res.json(data);
  });
});

router.post("/addYarnIssue", (req, res) => {
  // adds yarn Issue
  console.log("Add JJournals");

  console.log(req.body);
  const yarnIssue = new YarnIssue(req.body);
  Info.findByIdAndUpdate(
    "5d6a2eeef7935f12787d9cc6",
    {
      $inc: {
        yarnIssue_info: 1
      }
    },
    (err, data) => {
      console.log("inc", err, data);
      yarnIssue
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

router.get("/getYarnIssueInfo", (req, res) => {
  // gets yarn issues current record no
  Info.find({}, "yarnIssue_info").exec(function(err, data) {
    console.log("data", data);
    res.json(data);
    if (err) {
      console.log("err", err);
    }
  });
});

router.post("/addFabricQuality", (req, res) => {
  // adds fabric quality
  const fabricQuality = new FabricQuality(req.body);
  fabricQuality
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log("err", err);
    });
});

router.get("/getFabricQuality", (req, res) => {
  // gets fabric qualitys
  FabricQuality.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

router.post("/editFabricQuality", (req, res) => {
  // edits fabric qualitys
  console.log(req.body);
  const {
    _id,
    warp_count,
    weft_count,
    ends,
    picks,
    width,
    quality_name
  } = req.body;
  FabricQuality.findOne({ _id: _id }, function(err, data) {
    data.warp_count = warp_count;
    data.weft_count = weft_count;
    data.ends = ends;
    data.picks = picks;
    data.width = width;
    data.quality_name = quality_name;
    data.save();
    res.json(data);
  });
});

router.post("/editBrand", (req, res) => {
  // edits brands
  console.log(req.body);
  const { _id, brand } = req.body;
  Brand.findOne({ _id: _id }, function(err, data) {
    data.brand = brand;
    data.save();
    res.json(data);
  });
});

router.post("/editQuality", (req, res) => {
  // edits qualitys
  console.log(req.body);
  const { _id, quality } = req.body;
  Quality.findOne({ _id: _id }, function(err, data) {
    data.quality = quality;
    data.save();
    res.json(data);
  });
});

router.post("/editYarnQuality", (req, res) => {
  // edits yarn quality
  console.log(req.body);
  const { _id, yarn_count, s_d } = req.body;
  YarnQuality.findOne({ _id: _id }, function(err, data) {
    data.yarn_count = yarn_count;
    data.save();
    res.json(data);
  });
});

router.post("/addYarnQuality", (req, res) => {
  // add yarn quality
  const qualities = new YarnQuality(req.body);
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
  // get yarn quality
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
  // add quality
  const qualities = new Quality(req.body);
  Quality.findOne({ quality: req.body.quality }, (error, data) => {
    if (data) {
      res.json("Quality is already");
      return;
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
  // get brand qualitys
  Brand.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

router.post("/addBrand", (req, res) => {
  // edit brand qualitys
  const brands = new Brand(req.body);
  Brand.findOne({ brand: req.body.brand }, (error, data) => {
    if (data) {
      res.json("Quality is already");
      return;
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
  // get qualitys
  Quality.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

router.post("/editUnit", (req, res) => {
  // edits unit
  // console.log(req.body);
  const { _id, unit } = req.body;
  Unit.findOne({ _id: _id }, function(err, data) {
    console.log(err, data);
    data.unit = unit;
    data.save();
    res.json(data);
  });
});

router.get("/getUnit", (req, res) => {
  // get unitss
  Unit.find({}).exec(function(err, data) {
    if (err) {
      console.log("error", err);
      return;
    }
    res.json(data);
  });
});

router.post("/addUnit", (req, res) => {
  // if unit does not exists adds a new ones
  const units = new Unit(req.body);
  console.log("ok", units);
  Unit.findOne({ unit: req.body.unit }, (error, data) => {
    if (data) {
      res.json("Unit is already");
      return;
    }
    units
      .save()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.log("err", err);
      });
  });
});

module.exports = router;
///
