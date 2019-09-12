const express = require('express');
const router = express.Router();
const Companies = require('../models/AddCompanys')
const Accounts = require('../models/AddAccounts')
const AccNos = require('../models/AddAccNo');
const Banks = require('../models/AddBanks');

console.log('Add Company page')

router.get('/getBanks', (req, res) => {
    console.log('runned')
    Banks.find({}, (err, data) => {
        res.json(data);
    }).catch(err => {
        console.log('err')
        res.status(500).send('err', err)
    });
})


router.post('/addBanks', (req, res) => {
    console.log(req.body)
    Banks.findOne({ bank_name: req.body.bank_name }, (error, data) => {
        if (data) {
            res.json('this dept is already');
        }
        else {
            const AddBank = new Banks(req.body);
            AddBank.save().then(newCompanies => {
                Accounts.findByIdAndUpdate(req.body.main_code, {
                    $inc: {
                        last_bank_no: 1
                    }
                }, (er, d) => {
                    res.json(newCompanies);
                })
            }).catch(err => {
                console.log('err', err)
                res.status(500).send(err)
            });
        }
    })
})


router.post('/addAccounts', (req, res) => {
    console.log(req.body)
    let obj = req.body;
    const Account = new Accounts(obj);
    // { 'dept': obj.dept, 'd_no': obj.d_no }
    Accounts.findOne({ 'dept': obj.dept }, (err, data) => {
        if (data) res.json('this dept is already');
        else {
            Account.save().then(newAccounts => {

                AccNos.findByIdAndUpdate(obj.id, {
                    $inc: {
                        last_account_no: 1
                    }
                }, (er, d) => {
                    res.json(newAccounts);
                })
            }).catch(err => {
                console.log('err')
                res.status(500).send('err', err)
            });
        }
    }).catch(err => {
        console.log('err')
        res.status(500).send('err', err)
    });
})

router.post('/addCompanies', (req, res) => {
    console.log(req.body)
    Companies.findOne({ 'head_of_ac': req.body.head_of_ac }, (error, data) => {
        if (data) {
            res.json('this dept is already');
        }
        else {
            const Company = new Companies(req.body);
            Company.save().then(newCompanies => {
                Banks.findByIdAndUpdate(req.body.main_code, {
                    $inc: {
                        last_bank_no: 1
                    }
                }, (er, d) => {
                    res.json(newCompanies);
                })
            }).catch(err => {
                console.log('err')
                res.status(500).send('err', err)
            });
        }
    })
})


router.post('/editPayments', (req, res) => {
    console.log('Edit Payments Arr')
    console.log(req.body)

    const { _id, recordArr, party } = req.body;
    Companies.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.party = party;
        data.save();
        res.json(data);
    });
})


router.get('/getAccounts', (req, res) => {
    console.log('runned')
    Accounts.find({}, (err, data) => {
        res.json(data);
    }).catch(err => {
        console.log('err')
        res.status(500).send('err', err)
    });
})


router.get('/getCompanies', (req, res) => {
    console.log('runned')
    Companies.find({}).
        populate("bank_id").
        exec(function (err, data) {
            console.log('bank_id', data, err)
            res.json(data);
        });
})

router.get('/getCompanyByCode', (req, res) => {
    console.log('runned')
    Companies.findOne({ company_code: req.query.code }).
        exec(function (err, data) {
            console.log('bank_id', data, err)
            res.json(data);
        });
})


module.exports = router;