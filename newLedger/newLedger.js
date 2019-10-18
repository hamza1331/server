const express = require('express');
const router = express.Router();


const Payments = require('./../models/newPayments')
const Reciepts = require('./../models/newReciepts')
const Addjjournals = require('./../models/Addjjournals')

router.get('/getLedger', (req, res) => {

    // creates ledger by looping throgh jjounals, recipts and payments 

    var allArr = [];
    startingBalance = req.query.op_bal ? parseInt(req.query.op_bal) : 0;
    let current_op_bal = req.query.op_bal ? parseInt(req.query.op_bal) : 0;
    let debit = 0;
    let credit = 0;
    let ledger = null;
    // console.log('st', current_op_bal)
    Payments.find({}).
        populate([{path: 'party'}, {path: 'recordArr.payment_mode',  match: {company_code: req.query.code}}] ).exec(function (err, data) {
            if (err) {

                console.log('Error GetLedger', err);
            } else {
                console.log(data)
                res.json(data)
                // // data.forEach(v => {
                // //     v.recordArr.forEach(i => {
                // //         // console.log('v pay',v.party.company_code === req.query.code)
                // //         if ((i.payment_mode._id  == req.query.id || v.party.company_code === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                // //             i.record_type = i.record_type ? i.record_type : 'payment';
                // //             ledger = v.party.head_of_ac
                // //             console.log('ok py')
                // //             credit += i.amount;
                // //             allArr.push({ 'record_no': v.record_no, 'data': i, party_name: v.party.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                // //         } else if (req.query.sdate > v.generatedOn && (i.payment_mode._id  == req.query.id || v.party.company_code === req.query.code)) {
                // //             console.log('re____________', current_op_bal)
                // //             credit += i.amount;
                // //             current_op_bal -= parseInt(i.amount);
                // //         }
                // //     })
                // })
                // Reciepts.find({'recordArr.party.company_code': req.query.code}).
                //     populate("recordArr.party payment_mode", {
                //         select: 'recordArr.party',
                //         match: { company_code: req.query.code}
                //     }).exec(function (err, data) {
                //         if (err) {
                //             console.log('Error GetLedger', err);
                //         } else {
                //             data.forEach(v => {
                //                 v.recordArr.forEach(i => {
                //                     if ((i.party._id == req.query.id || v.payment_mode.company_code === req.query.code) && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                //                       debit += i.amount;
                //                         i.record_type = i.record_type ? i.record_type : 'reciept'
                //                         allArr.push({ 'record_no': v.record_no, 'data': i, party_name: v.payment_mode.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                //                     }
                //                     if (req.query.sdate > v.generatedOn && (i.party._id == req.query.id || v.payment_mode.company_code === req.query.code)) {
                //                         console.log('re__________', current_op_bal)
                //                         debit += i.amount;
                //                         current_op_bal += parseInt(i.amount);
                //                     }
                //                 })
                //             })
                //             Addjjournals.find({}).
                //                 populate("recordArr.particulars").exec(function (err, data) {
                //                     if (err) {
                //                         console.log('Error GetLedger', err);
                //                     } else {

                //                         data.forEach(v => {

                //                             v.recordArr.forEach(i => {
                //                                 if (req.query.id == i.particulars._id && req.query.edate > v.generatedOn && req.query.sdate < v.generatedOn) {
                //                                   if (i.debit !== 0) {
                //                                       debit += i.debit
                //                                       startingBalance += parseInt(i.debit);
                //                                   } else {
                //                                       startingBalance -= parseInt(i.credit);
                //                                       debit -= i.credit
                //                                   }
                //                                     allArr.push({ 'record_no': v.record_no, 'data': i, party_name: i.particulars.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: current_op_bal })
                //                                 }
                //                                 if (req.query.sdate > v.generatedOn && i.particulars._id == req.query.id) {
                //                                     if (i.debit !== 0) {
                //                                         if (req.query.sdate > v.generatedOn) current_op_bal += parseInt(i.debit);
                //                                         debit += i.debit
                //                                     } else {
                //                                         if (req.query.sdate > v.generatedOn) current_op_bal -= parseInt(i.debit);
                //                                         debit -= i.credit
                //                                     }
                //                                 }
                //                             })
                //                         })

                //                         console.log('credit',credit, debit)

                //                         if(req.query.onlyBalanceDetails) {
                //                           let finalDebit = 0;
                //                           let finalCredit = 0
                //                           let final = 0;
                //                           allArr.map(v => {
                //                             if (v.data.record_type === "jjournal") {
                //                                 if (v.data.debit !== 0) {
                //                                     finalDebit += parseInt(v.data.debit)
                //                                     // console.log(typeof v.data.debit, typeof startingBalance)
                //                                 } else {
                //                                     finalCredit += parseInt(v.data.credit)
                //                                     // console.log(typeof v.data.credit, typeof startingBalance)
                //                                 }
                //                             }
                //                             else if (v.data.record_type === "reciept") {
                //                                 finalDebit += parseInt(v.data.amount)
                //                             }
                //                             else if (v.data.record_type === "payment") {
                //                                 finalCredit += parseInt(v.data.amount)
                //                             }
                //                           })

                //                           // if(current_op_bal < 0) {
                //                           //   final -= current_op_bal
                //                           // } else {
                //                           //   final += current_op_bal
                //                           // }

                //                           let x = {
                //                               finalDebit,
                //                               finalCredit,
                //                               final: (finalDebit - finalCredit) + current_op_bal,
                //                               ledger: req.query.name,
                //                               code: req.query.code,
                //                               _id: req.query.id,
                //                               op_bal: req.query.op_bal ? parseInt(req.query.op_bal) : 0,
                //                               current_op_bal,
                //                           }

                //                           res.json(x);
                //                           return;
                //                         }

                //                         let x = {
                //                             arr: allArr,
                //                             current_op_bal,
                //                             credit,
                //                             debit,
                //                             final: (credit - debit) + current_op_bal
                //                         }

                //                         res.json(x);
                //                     }
                //                 });
                //         }
                //     });
                // })
            }
        });

})

module.exports = router;
