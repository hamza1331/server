const express = require('express');
const router = express.Router();


const Payments = require('./../models/newPayments')
const Reciepts = require('./../models/newReciepts')
const Addjjournals = require('./../models/Addjjournals')

router.get('/getLedger', (req, res) => {
    console.log('ok', req.query);

    var allArr = [];
    startingBalance = req.query.op_bal ? parseInt(req.query.op_bal) : 0;
    let current_op_bal = startingBalance;
    debit = 0;
    credit = 0;
    // console.log('st', current_op_bal)
    Payments.find({}).
        populate("recordArr.payment_mode party").exec(function (err, data) {
            if (err) {

                console.log('Error GetLedger');
            } else {
                data.forEach(v => {
                    v.recordArr.forEach(i => {
                        console.log('v pay',v.party.company_code === req.query.code)
                        if ((i.payment_mode._id  == req.query.id || v.party.company_code === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                            i.record_type = i.record_type ? i.record_type : 'payment'
                            console.log('ok py')
                            allArr.push({ 'record_no': v.record_no, 'data': i, party_name: v.party_name, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                            // console.log('py1', req.query.sdate > v.generatedOn)
                            // if (req.query.sdate > v.generatedOn) current_op_bal -= parseInt(i.amount);
                        } else if (req.query.sdate > v.generatedOn && i.party._id == req.query.id) {
                            console.log('re', current_op_bal)
                            current_op_bal += parseInt(i.amount);
                        }
                    })
                })
                Reciepts.find({}).
                    populate("recordArr.party payment_mode").exec(function (err, data) {
                        if (err) {
                            console.log('Error GetLedger');
                        } else {
                            data.forEach(v => {
                                // if () 
                                v.recordArr.forEach(i => {
                                    // console.log(req.query.sdate < req.query.edate)
                                    if ((i.party._id == req.query.id || v.payment_mode.company_code === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {

                                        i.record_type = i.record_type ? i.record_type : 'reciept'
                                        // startingBalance -= parseInt(i.amount);
                                        allArr.push({ 'record_no': v.record_no, 'data': i, party_name: v.party_name, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                                        // console.log('py1', req.query.sdate > v.generatedOn)
                                    }
                                    else if (req.query.sdate > v.generatedOn && i.party._id == req.query.id) {
                                        console.log('re', current_op_bal)
                                        current_op_bal += parseInt(i.amount);
                                    }
                                })
                            })
                            Addjjournals.find({}).
                                populate("recordArr.particulars").exec(function (err, data) {
                                    if (err) {
                                        console.log('Error GetLedger');
                                    } else {

                                        data.forEach(v => {
                                            v.recordArr.forEach(i => {
                                                if (i.debit !== 0) {
                                                    startingBalance += parseInt(i.debit);
                                                } else {
                                                    startingBalance -= parseInt(i.credit);
                                                }
                                                // console.log('jj', current_op_bal)

                                                if (req.query.id == i.particulars._id && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                                                    allArr.push({ 'record_no': v.record_no, 'data': i, party_name: v.party_name, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                                                }
                                                else if (req.query.sdate > v.generatedOn && i.particulars._id == req.query.id) {
                                                    if (i.debit !== 0) {
                                                        if (req.query.sdate > v.generatedOn) current_op_bal += parseInt(i.debit);
                                                    } else {
                                                        if (req.query.sdate > v.generatedOn) current_op_bal -= parseInt(i.debit);
                                                    }
                                                }
                                            })
                                        })

                                        let x = {
                                            arr: allArr,
                                            current_op_bal
                                        }

                                        res.json(x);
                                    }
                                });
                        }
                    });
                // })
            }
        });

})

module.exports = router;