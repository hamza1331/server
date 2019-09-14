const express = require('express');
const router = express.Router();
const Accounts = require('../models/AddAccounts')
const Banks = require('../models/AddBanks');


const Companies = require('../models/AddCompanys')
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
                        // console.log('i', i)
                        startingBalance -= parseInt(i.amount);
                        allArr.push({ parent_code: v.party.company_code, _id: v.party._id, generated_on: v.party.generatedOn, 'record_no': v.record_no, 'data': i, party_name: v.party.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: v.party.op_bal ? v.party.op_bal : 0, code: i.payment_mode.company_code, record_type: i.record_type })
                    })
                })
                Reciepts.find({}).
                    populate("recordArr.party payment_mode").exec(function (err, data) {
                        if (err) {
                            console.log('Error GetLedger');
                        } else {
                            data.forEach(v => {
                                v.recordArr.forEach(i => {
                                    // console.log(i)
                                    startingBalance += parseInt(i.amount);
                                    allArr.push({ parent_code: v.payment_mode.company_code, _id: v.payment_mode._id, generated_on: v.payment_mode.generatedOn, 'record_no': v.record_no, 'data': i, party_name: v.payment_mode.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: v.payment_mode.op_bal ? v.payment_mode.op_bal : 0, code: i.party.company_code, record_type: i.record_type })
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
                                                allArr.push({parent_code: i.particulars.company_code, _id: i._id, generated_on: i.generatedOn, 'record_no': v.record_no, 'data': i, party_name: i.particulars.head_of_ac, date: v.generatedOn, balance: startingBalance, op_bal: i.particulars.op_bal ? i.particulars.op_bal : 0, code: i.particulars.company_code, record_type: i.record_type })
                                            })
                                        })


                                        console.log('runned')
                                        Accounts.find({}, (err, data) => {
                                            accArr = data;
                                            console.log('runned')
                                            Banks.find({}, (err, data) => {
                                                bankArr = data;

                                                Companies.find({}, (err, data) => {
                                                    comArr = data;
                                                    let mainArr = allArr.sort(function (a, b) {
                                                        return ('' + a.code).localeCompare(b.code);
                                                    })


                                                    let finalTrail = [];

                                                    let debit = 0;
                                                    let credit = 0;
                                                    mainArr.map((v, i) => {
                                                        // if(i !== 0 && mainArr[(i - 1)].code !== v.code) {
                                                        // console.log('i',v.generated_on, v.party_name)
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

                                                        // if (!v.code) {
                                                            console.log(v.parent_code, v.party_name, v.record_type)
                                                        // }
                                                        finalTrail.push({
                                                            generated_on: v.data.generated_on,
                                                            _id: v._id,
                                                            op_bal: v.op_bal,
                                                            code: v.code,
                                                            party_name: v.party_name,
                                                            parent_code: v.parent_code,
                                                            credit,
                                                            debit,
                                                            record_type: v.record_type,
                                                            record_no: v.record_no,
                                                            // party_child: v.data['party'] && v.data['party'].head_of_ac || v.data['payment_mode'] && v.data['payment_mode'].head_of_ac || v.data['particulars'] && v.data['particulars'].head_of_ac,
                                                            // child_code: v.data['party'] && v.data['party'].company_code || v.data['payment_mode'] && v.data['payment_mode'].company_code || v.data['particulars'] && v.data['particulars'].company_code
                                                        })

                                                        credit = 0; debit = 0

                                                    })

                                                    // let finalTrailSorted = finalTrail.sort(function (a, b) {
                                                    //     return ('' + a.pa).localeCompare(b.pa);
                                                    // });

                                                    let grandpa = {}
                                                    let obj = {};
                                                    let arry = []
                                                    finalTrail.forEach((v, i) => {
                                                        if (obj[v.parent_code] === undefined) {
                                                            obj[v.parent_code] = arry.length
                                                            arry.push({
                                                                code: v.parent_code,
                                                                name: v.party_name,
                                                                child_code: v.code,
                                                                op_bal: v.op_bal,
                                                                _id: v._id,
                                                                generated_on: v.generated_on,
                                                                data: [v],
                                                            })
                                                        } else {
                                                            arry[obj[v.parent_code]].data.push(v);
                                                        }
                                                        // console.log(arry)
                                                    })

                                                    // console.log('a,', bankArr);


                                                    fun = (name, code) => {
                                                        accArr.map((v, i) => {
                                                            bankArr.map(b => {
                                                                comArr.map(c => {
                                                                    if (b.bank_code === code.slice(0, 5) && v.d_code === code.slice(0, 3)) {
                                                                        if (grandpa[name] === undefined) {
                                                                            grandpa[name] = {}
                                                                        }

                                                                        if (grandpa[name][v.dept.split(' ').join('_')] === undefined) {
                                                                            grandpa[name][v.dept.split(' ').join('_')] = {}
                                                                        }

                                                                        if (grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] === undefined) {
                                                                            grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')] = {}
                                                                        }
                                                                        if (code === c.company_code) {
                                                                            if (grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')][c.head_of_ac.split(' ').join('_')] === undefined) {
                                                                                grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')][c.head_of_ac.split(' ').join('_')] = []
                                                                            }
                                                                            if (grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')][c.head_of_ac.split(' ').join('_')] !== undefined) {
                                                                                grandpa[name][v.dept.split(' ').join('_')][b.bank_name.split(' ').join('_')][c.head_of_ac.split(' ').join('_')].push(arry.pop())
                                                                            }
                                                                        }
                                                                       
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }

                                                    // let soertedArry = arry

                                                    Object.keys(obj).reverse().map(v => {
                                                        if (arry[obj[v]]) {
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
                                                        }
                                                    })

                                                    res.json(grandpa);

                                                })
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