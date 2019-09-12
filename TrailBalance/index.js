const express = require('express');
const router = express.Router();
const Companies = require('../models/AddCompanys')
const Accounts = require('../models/AddAccounts')
const Banks = require('../models/AddBanks');


const Payments = require('./../models/newPayments')
const Reciepts = require('./../models/newReciepts')
const Addjjournals = require('./../models/Addjjournals')

router.get('/getTrail', (req, res) => {

    // console.log(req.query.id);

    var allArr = [];
    startingBalance = req.query.op_bal ? req.query.op_bal : 0;
    let current_op_bal = startingBalance;
    debit = 0;
    credit = 0;
    // console.log('st', current_op_bal)



    let comArr = null;
    let bankArr = null;
    let accArr = null;







    Payments.find({}).
        populate("recordArr.payment_mode party").exec(function (err, data) {
            if (err) {
                console.log('Error GetLedger');
            } else {
                data.forEach(v => {
                    // console.log('py', v)
                    v.recordArr.forEach(i => {
                        console.log('i', i)
                        startingBalance -= parseInt(i.amount);
                        allArr.push({ _id: v.party._id, generated_on: v.party.generatedOn, 'record_no': v.record_no, 'data': i, party_name: v.party.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: i.payment_mode.op_bal ? i.payment_mode.op_bal : 0, code: i.payment_mode.company_code, record_type: i.record_type })
                    })
                })
                Reciepts.find({}).
                    populate("recordArr.party payment_mode").exec(function (err, data) {
                        if (err) {
                            console.log('Error GetLedger');
                        } else {
                            data.forEach(v => {
                                v.recordArr.forEach(i => {
                                    console.log(i)
                                    startingBalance += parseInt(i.amount);
                                    allArr.push({ _id: v.payment_mode._id, generated_on: v.payment_mode.generatedOn, 'record_no': v.record_no, 'data': i, party_name: v.payment_mode.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: i.party.op_bal ? i.party.op_bal : 0, code: i.party.company_code, record_type: i.record_type })
                                })
                            })
                            Addjjournals.find({}).
                                populate("recordArr.particulars ").exec(function (err, data) {
                                    if (err) {
                                        console.log('Error GetLedger');
                                    } else {
                                        data.forEach(v => {
                                            v.recordArr.forEach(i => {
                                                // // console.log('jj', current_op_bal)
                                                if (i.debit !== 0) {
                                                    startingBalance += parseInt(i.debit);
                                                } else {
                                                    startingBalance -= parseInt(i.credit);
                                                }
                                                allArr.push({ _id: i._id, generated_on: i.generatedOn, 'record_no': v.record_no, 'data': i, party_name: i.particulars.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: i.particulars.op_bal ? i.particulars.op_bal : 0, code: i.particulars.company_code, record_type: i.record_type })
                                            })
                                        })


                                        console.log('runned')
                                        Accounts.find({}, (err, data) => {
                                            accArr = data.sort(function (a, b) {
                                                return ('' + a.d_code).localeCompare(b.d_code);
                                            });
                                            console.log('runned')
                                            Banks.find({}, (err, data) => {
                                                bankArr = data.sort(function (a, b) {
                                                    return ('' + a.bank_code).localeCompare(b.bank_code);
                                                });


                                                let mainArr = allArr.sort(function (a, b) {
                                                    return ('' + a.code).localeCompare(b.code);
                                                })


                                                let finalTrail = [];

                                                let debit = 0;
                                                let credit = 0;
                                                mainArr.map((v, i) => {
                                                    // if(i !== 0 && mainArr[(i - 1)].code !== v.code) {
                                                        console.log('i',v.generated_on, v.party_name)
                                                    if (v.data.record_type === "payment") {
                                                        credit -= parseInt(v.data.amount);
                                                        // console.log('py', credit, v.data.amount)
                                                    }
                                                    if (v.data.record_type === "reciept") {
                                                        debit += parseInt(v.data.amount);
                                                        // console.log('re', debit, v.data.amount)
                                                    }
                                                    if (v.data.record_type === "jjournal") {
                                                        if (v.data.debit !== 0) {
                                                            debit += parseInt(v.data.debit);
                                                            // console.log('dept', debit, v.data.debit)
                                                        } else {
                                                            credit -= parseInt(v.data.credit);
                                                            // console.log('cre', credit, v.data.credit)
                                                        }
                                                    }
                                                    // }

                                                    // console.log(i, 'v.code', v)

                                                    finalTrail.push({
                                                        generated_on: v.data.generated_on,
                                                        _id: v._id,
                                                        op_bal: v.op_bal,
                                                        code: v.code,
                                                        party_name: v.party_name,
                                                        credit,
                                                        debit,
                                                        record_type: v.record_type,
                                                        record_no: v.record_no,
                                                        party_child: v.data['party'] && v.data['party'].head_of_ac || v.data['payment_mode'] && v.data['payment_mode'].head_of_ac || v.data['particulars'] && v.data['particulars'].head_of_ac,
                                                        child_code: v.data['party'] && v.data['party'].company_code || v.data['payment_mode'] && v.data['payment_mode'].company_code || v.data['particulars'] && v.data['particulars'].company_code
                                                    })

                                                    credit = 0; debit = 0

                                                })

                                                // let finalTrailSorted = finalTrail.sort(function (a, b) {
                                                //     return ('' + a.child_code).localeCompare(b.child_code);
                                                // });

                                                let grandpa = {}
                                                let obj = {};
                                                let arry = []
                                                finalTrail.forEach((v, i) => {
                                                    if (obj[v.code] === undefined) {
                                                        obj[v.code] = arry.length
                                                        arry.push({
                                                            code: v.child_code,
                                                            name: v.party_child,
                                                            op_bal: v.op_bal,
                                                            _id: v._id,
                                                            generated_on: v.generated_on,
                                                            data: [v],
                                                        })
                                                    } else {
                                                        arry[obj[v.code]].data.push(v)
                                                    }
                                                    // console.log(arry)
                                                })

                                                // console.log('a,', bankArr);


                                                fun = (name, code) => {
                                                    console.log(code.slice(0, 5),'ok')
                                                    // if (grandpa[name] === undefined) {
                                                    accArr.map((v, i) => {
                                                        // console.log('outer v 1', i, '-', code.slice(0, 3), 'to', v.d_code)
                                                        // // if (v.d_code === code.slice(0, 3)) {
                                                        // console.log(code, 'iner v 1', i)

                                                        bankArr.map(b => {
                                                            // console.log(b.bank_code === code.slice(0, 5), 'bank stae', b.bank_code, code.slice(0, 5))
                                                            if (b.bank_code === code.slice(0, 5) && v.d_code === code.slice(0, 3)) {
                                                                // console.log(code.slice(0, 5), '-', b.bank_code, 'outer')
                                                                if (grandpa[name] === undefined) {
                                                                    grandpa[name] = {

                                                                    }
                                                                }

                                                                if (grandpa[name][v.dept.split(' ').join('_')] === undefined) {
                                                                    grandpa[name][v.dept.split(' ').join('_')] = {

                                                                    }
                                                                }

                                                                if (grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] === undefined) {
                                                                    grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] = {

                                                                    }
                                                                }

                                                                if (grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] !== undefined) {
                                                                    grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] = [...[arry.pop()]]
                                                                }
                                                            }
                                                        })
                                                    })
                                                }

                                                // let soertedArry = arry

                                                Object.keys(obj).reverse().forEach(v => {
                                                    // console.log(arry[obj[v]].code[0], 1, obj[v])
                                                    switch (arry[obj[v]].code[0]) {
                                                        case '1':
                                                            fun('Assets', arry[obj[v]].code)
                                                            break;
                                                        case '2':
                                                            fun('Laibilities', arry[obj[v]].code)
                                                            break;
                                                        case '3':
                                                            fun('Capital', arry[obj[v]].code)
                                                            break;
                                                        case '4':
                                                            fun('Income', arry[obj[v]].code)
                                                            break;
                                                        case '5':
                                                            fun('Expense', arry[obj[v]].code)
                                                            break;
                                                    }
                                                })
                                                // Object.keys(grandpa).forEach(v => { grandpa[v] = grandpa[v].reverse() });
                                                // console.log(grandpa)
                                                res.json(grandpa);

                                            }).catch(err => {
                                                console.log('err')
                                                res.status(500).send('err', err)
                                            });
                                        }).catch(err => {
                                            console.log('err')
                                            res.status(500).send('err', err)
                                        });

                                        // console.log(current_op_bal)
                                    }
                                });
                        }
                    });
            }
        });
})

module.exports = router;