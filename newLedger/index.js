const express = require("express");
const router = express.Router();

const Payments = require("./../models/newPayments");
const Reciepts = require("./../models/newReciepts");
const Addjjournals = require("./../models/Addjjournals");
const YarnIssue = require("./../models/addYarnIssue");

router.get("/getLedger", (req, res) => {
  // creates ledger by looping throgh jjounals, recipts and payments

  var allArr = [];
  startingBalance = req.query.op_bal ? parseInt(req.query.op_bal) : 0;
  let current_op_bal = req.query.op_bal ? parseInt(req.query.op_bal) : 0;
  let debit = 0;
  let credit = 0;
  let ledger = null;
  // console.log('st', current_op_bal)
  Payments.find({})
    .populate("recordArr.payment_mode party")
    .exec(function(err, data) {
      if (err) {
        console.log("Error GetLedger");
      } else {
        data.forEach(v => {
          v.recordArr.forEach(i => {
            // console.log('v pay',v.party.company_code === req.query.code)
            if (
              (i.payment_mode._id == req.query.id ||
                v.party.company_code === req.query.code) &&
              req.query.edate > v.generatedOn &&
              req.query.sdate < v.generatedOn
            ) {
              i.record_type = i.record_type ? i.record_type : "payment";
              ledger = v.party.head_of_ac;
              console.log("ok py");
              credit += i.amount;
              allArr.push({
                record_no: v.record_no,
                data: i,
                party_name: v.party.head_of_ac,
                date: v.generatedOn,
                balance: startingBalance,
                op_bal: current_op_bal
              });
            } else if (
              req.query.sdate > v.generatedOn &&
              (i.payment_mode._id == req.query.id ||
                v.party.company_code === req.query.code)
            ) {
              console.log("re____________", current_op_bal);
              credit += i.amount;
              current_op_bal -= parseInt(i.amount);
            }
          });
        });
        Reciepts.find({})
          .populate("recordArr.party payment_mode")
          .exec(function(err, data) {
            if (err) {
              console.log("Error GetLedger");
            } else {
              data.forEach(v => {
                v.recordArr.forEach(i => {
                  if (
                    (i.party._id == req.query.id ||
                      v.payment_mode.company_code === req.query.code) &&
                    req.query.edate > v.generatedOn &&
                    req.query.sdate < v.generatedOn
                  ) {
                    debit += i.amount;
                    i.record_type = i.record_type ? i.record_type : "reciept";
                    allArr.push({
                      record_no: v.record_no,
                      data: i,
                      party_name: v.payment_mode.head_of_ac,
                      date: v.generatedOn,
                      balance: startingBalance,
                      op_bal: current_op_bal
                    });
                  }
                  if (
                    req.query.sdate > v.generatedOn &&
                    (i.party._id == req.query.id ||
                      v.payment_mode.company_code === req.query.code)
                  ) {
                    console.log("re__________", current_op_bal);
                    debit += i.amount;
                    current_op_bal += parseInt(i.amount);
                  }
                });
              });
              Addjjournals.find({})
                .populate("recordArr.particulars")
                .exec(function(err, data) {
                  if (err) {
                    console.log("Error GetLedger");
                  } else {
                    data.forEach(v => {
                      v.recordArr.forEach(i => {
                        if (
                          req.query.id == i.particulars._id &&
                          req.query.edate > v.generatedOn &&
                          req.query.sdate < v.generatedOn
                        ) {
                          if (i.debit !== 0) {
                            debit += i.debit;
                            startingBalance += parseInt(i.debit);
                          } else {
                            startingBalance -= parseInt(i.credit);
                            debit -= i.credit;
                          }
                          allArr.push({
                            record_no: v.record_no,
                            data: i,
                            party_name: i.particulars.head_of_ac,
                            date: v.generatedOn,
                            balance: startingBalance,
                            op_bal: current_op_bal
                          });
                        }
                        if (
                          req.query.sdate > v.generatedOn &&
                          i.particulars._id == req.query.id
                        ) {
                          if (i.debit !== 0) {
                            if (req.query.sdate > v.generatedOn)
                              current_op_bal += parseInt(i.debit);
                            debit += i.debit;
                          } else {
                            if (req.query.sdate > v.generatedOn)
                              current_op_bal -= parseInt(i.debit);
                            debit -= i.credit;
                          }
                        }
                      });
                    });

                    let yarn_arr = [];

                    YarnIssue.find({})
                      .populate(
                        "inner.chartOfAccounts inner.count outer.chartOfAccounts"
                      )
                      .exec(function(err, data) {
                        if (err) {
                          console.log("Error GetLedger");
                        } else {
                          data.map(v => {
                            v.inner.map(inner => {
                              if(('1-1-5-1' === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                                
                              if (inner.type !== "Received") {
                                credit += (inner.total_weight * inner.rate) * inner.gst/100;
                                if (
                                  inner.chartOfAccounts &&
                                  req.query.edate > v.generatedOn &&
                                  req.query.sdate < v.generatedOn
                                ) {
                                  let remarks =
                                    inner.type === "Purchased"
                                      ? "To Record Purchase of Yarn " +
                                        inner.count.yarn_count +
                                        ",cartons => " +
                                        inner.no_of_cartons +
                                        ",kgs  => " +
                                        inner.total_weight +
                                        ",Lbs  => " +
                                        inner.total_weight_lbs +
                                        "@ => " +
                                        inner.total_amount +
                                        ",D/o No.  => " +
                                        inner.d_no +
                                        ",Party Name  => " +
                                        inner.chartOfAccounts.head_of_ac +
                                        "."
                                      : "To Record Twisting Charges" +
                                        inner.count.yarn_count +
                                        ",cartons => " +
                                        inner.no_of_cartons +
                                        ",kgs  => " +
                                        inner.total_weight +
                                        ",Lbs  => " +
                                        inner.total_weight_lbs +
                                        "@ => " +
                                        inner.rate +
                                        ",D/o No.  => " +
                                        inner.d_no +
                                        ",Party Name  => " +
                                        inner.chartOfAccounts.head_of_ac +
                                        ".";

                                  yarn_arr.push({
                                    record_no: v.record_no,
                                    data: inner,
                                    record_type:
                                      inner.type === "Purchased"
                                        ? "Yarn Purchased"
                                        : "Yarn Twisted",
                                    remarks: remarks,
                                    party_name: "Sales Tax",
                                    date: v.generatedOn,
                                    balance: startingBalance,
                                    op_bal: current_op_bal
                                  });
                                } else if (
                                  req.query.sdate > v.generatedOn &&
                                    ('1-1-5-1' === req.query.code)
                                ) {
                                  console.log("re____________", current_op_bal);
                                  credit += (inner.total_amount * inner.rate)*inner.gst/100;
                                  current_op_bal -= parseInt(
                                    (inner.total_amount * inner.rate)*inner.gst/100
                                  );
                                }
                              }
                              return;
                              }

                              if(('5-3-1-1' === req.query.code || '5-1-4-1' === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                                
                                if (inner.type !== "Received") {
                                  credit += inner.total_weight * inner.rate ;
                                  if (
                                    inner.chartOfAccounts
                                  ) {
                                    let remarks =
                                    inner.type === "Purchased"
                                    ? "To Record Purchase of Yarn " +
                                          inner.count.yarn_count +
                                          ",cartons => " +
                                          inner.no_of_cartons +
                                          ",kgs  => " +
                                          inner.total_weight +
                                          ",Lbs  => " +
                                          inner.total_weight_lbs +
                                          "@ => " +
                                          inner.total_amount +
                                          ",D/o No.  => " +
                                          inner.d_no +
                                          ",Party Name  => " +
                                          inner.chartOfAccounts.head_of_ac +
                                          "."
                                        : "To Record Twisting Charges" +
                                          inner.count.yarn_count +
                                          ",cartons => " +
                                          inner.no_of_cartons +
                                          ",kgs  => " +
                                          inner.total_weight +
                                          ",Lbs  => " +
                                          inner.total_weight_lbs +
                                          "@ => " +
                                          inner.rate +
                                          ",D/o No.  => " +
                                          inner.d_no +
                                          ",Party Name  => " +
                                          inner.chartOfAccounts.head_of_ac +
                                          ".";
  
                                          if(req.query.code === "5-1-4-1" && inner.type === "Twisted") {
                                            yarn_arr.push({
                                              record_no: v.record_no,
                                              data: inner,
                                              record_type:
                                               "Yarn Twisted",
                                              remarks: remarks,
                                              party_name: "Twisting Expense",
                                              date: v.generatedOn,
                                              balance: startingBalance,
                                              op_bal: current_op_bal
                                            });
                                          }

                                          
                                          if(req.query.code === "5-3-1-1" && inner.type === "Purchased") {
                                            yarn_arr.push({
                                              record_no: v.record_no,
                                              data: inner,
                                              record_type:
                                               "Yarn Purchase",
                                              remarks: remarks,
                                              party_name:
                                                 "Yarn Purchase",
                                              date: v.generatedOn,
                                              balance: startingBalance,
                                              op_bal: current_op_bal
                                            });
                                          }
                                 
                                  } else if (
                                    req.query.sdate > v.generatedOn &&
                                    (('5-3-1-1' === req.query.code || '5-1-4-1' === req.query.code))
                                  ) {
                                    console.log("re____________", current_op_bal);
                                    credit += parseInt((inner.total_amount * inner.rate) + (inner.total_amount * inner.rate)*inner.gst/100);
                                    current_op_bal -= parseInt(
                                      parseInt((inner.total_amount * inner.rate) + (inner.total_amount * inner.rate)*inner.gst/100)
                                    );
                                  }
                                }
                                return;
                                }

                              if (inner.type !== "Received") {
                                credit += inner.total_amount;
                                if (
                                  inner.chartOfAccounts &&
                                  inner.chartOfAccounts.company_code ===
                                    req.query.code &&
                                  req.query.edate > v.generatedOn &&
                                  req.query.sdate < v.generatedOn
                                ) {
                                  let remarks =
                                    inner.type === "Purchased"
                                      ? "To Record Purchase of Yarn " +
                                        inner.count.yarn_count +
                                        ",cartons => " +
                                        inner.no_of_cartons +
                                        ",kgs  => " +
                                        inner.total_weight +
                                        ",Lbs  => " +
                                        inner.total_weight_lbs +
                                        "@ => " +
                                        inner.rate +
                                        ",D/o No.  => " +
                                        inner.d_no +
                                        ",Party Name  => " +
                                        inner.chartOfAccounts.head_of_ac +
                                        "."
                                      : "To Record Twisting Charges" +
                                        inner.count.yarn_count +
                                        ",cartons => " +
                                        inner.no_of_cartons +
                                        ",kgs  => " +
                                        inner.total_weight +
                                        ",Lbs  => " +
                                        inner.total_weight_lbs +
                                        "@ => " +
                                        inner.total_amount +
                                        ",D/o No.  => " +
                                        inner.d_no +
                                        ",Party Name  => " +
                                        inner.chartOfAccounts.head_of_ac +
                                        ".";

                                  yarn_arr.push({
                                    record_no: v.record_no,
                                    data: inner,
                                    record_type:
                                      inner.type === "Purchased"
                                        ? "Yarn Purchased"
                                        : "Yarn Twisted",
                                    remarks: remarks,
                                    party_name:
                                      inner.type === "Purchased"
                                        ? "Yarn Purchase"
                                        : "Twisting Expenses",
                                    date: v.generatedOn,
                                    balance: startingBalance,
                                    op_bal: current_op_bal,
                                    party: true
                                  });
                                } else if (
                                  req.query.sdate > v.generatedOn &&
                                  ('5-3-1-1' === req.query.code || '5-1-4-1' === req.query.code)
                                ) {
                                  console.log("re____________", current_op_bal);
                                  credit += inner.total_amount;
                                  current_op_bal -= parseInt(
                                    inner.total_amount
                                  );
                                }
                              }
                              // console.log('inner',inner.chartOfAccounts && req.query.id == inner.chartOfAccounts._id)
                            });
                          });
                          // console.log('arr', yarn_arr);
                          // res.json(yarn_arr)

                          console.log("credit", credit, debit);
                          if (req.query.onlyBalanceDetails) {
                            let finalDebit = 0;
                            let finalCredit = 0;
                            // let final = 0;
                            [...allArr, ...yarn_arr].map(v => {
                              if (v.data.record_type === "jjournal") {
                                if (v.data.debit !== 0) {
                                  finalDebit += parseInt(v.data.debit);
                                  // console.log(typeof v.data.debit, typeof startingBalance)
                                } else {
                                  finalCredit += parseInt(v.data.credit);
                                  // console.log(typeof v.data.credit, typeof startingBalance)
                                }
                              } else if (v.data.record_type === "reciept") {
                                finalDebit += parseInt(v.data.amount);
                              } else if (v.data.record_type === "payment") {
                                finalCredit += parseInt(v.data.amount);
                              } else if (
                                v.record_type ===
                                ("Yarn Purchased" || "Yarn Twisted")
                              ) {
                                finalDebit += parseInt(((v.data.total_weight * v.data.rate) * v.data.gst/100) + (v.data.total_weight * v.data.rate));
                              }
                              else if (
                                v.record_type ===
                                ("Sales Tax")
                              ) {
                                finalDebit += parseInt((v.data.total_amount * v.data.rate)*v.data.gst/100);
                              }
                            });

                            // if(current_op_bal < 0) {
                            //   final -= current_op_bal
                            // } else {
                            //   final += current_op_bal
                            // }

                            let x = {
                              finalDebit,
                              finalCredit,
                              final: finalDebit - finalCredit + current_op_bal,
                              ledger: req.query.name,
                              code: req.query.code,
                              _id: req.query.id,
                              op_bal: req.query.op_bal
                                ? parseInt(req.query.op_bal)
                                : 0,
                              current_op_bal
                            };

                            res.json(x);
                            return;
                          }

                          let x = {
                            arr: [...allArr, ...yarn_arr],
                            current_op_bal,
                            credit,
                            debit,
                            final: credit - debit + current_op_bal
                          };

                          res.json(x);
                        }
                      });
                  }
                });
            }
          });
        // })
      }
    });
});

module.exports = router;
