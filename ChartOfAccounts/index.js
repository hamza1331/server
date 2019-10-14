const express = require('express');
const router = express.Router();
const Companies = require('../models/AddCompanys')
const Accounts = require('../models/AddAccounts')
const AccNos = require('../models/AddAccNo');
const Banks = require('../models/AddBanks');

console.log('Add Company page')

router.get('/getBanks', (req, res) => {
    // get banks data
    console.log('runned')
    Banks.find({}, (err, data) => {
        res.json(data);
    }).catch(err => {
        console.log('err')
        res.status(500).send('err', err)
    });
})


router.post('/addBanks', (req, res) => {
    // if bank data does not exists adds new datas
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
    // adds accounts if it does not already exists by htat name/depts
    // console.log(req.body)
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
    // adds new company/level_4 if it doesnot already exists by that name
    // console.log(req.body)
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


router.post('/editCompanys', (req, res) => {
    // edits companys
    // console.log('Edit Payments Arr')
    // console.log(req.body)

    const { _id, previous_year, address, op_bal, sales_tax, ntn_no, head_of_ac } = req.body;
    Companies.findOne({ _id: _id }, function (err, data) {
        data.previous_year = previous_year;
        data.address = address;
        data.op_bal = op_bal;
        data.sales_tax = sales_tax;
        data.ntn_no = ntn_no;
        data.head_of_ac = head_of_ac;
        data.save();
        res.json(data);
    });
})


router.post('/editAccounts', (req, res) => {
    // console.log(req.body)
// edits accountss
    const { _id, dept } = req.body;
    Accounts.findOne({ _id: _id }, function (err, data) {
        data.dept = dept;
        data.save();
        res.json(data);
    });
})


router.post('/editBanks', (req, res) => {
    // console.log(req.body)
    // edits banks
    const { _id, bank_name } = req.body;
    Banks.findOne({ _id: _id }, function (err, data) {
        // console.log('err', data)
        data.bank_name = bank_name;
        data.save();
        res.json(data);
    });
})


router.get('/getAccounts', (req, res) => {
    // console.log('runned')
    // get accountss
    Accounts.find({}, (err, data) => {
        res.json(data);
    }).catch(err => {
        console.log('err')
        res.status(500).send('err', err)
    });
})


router.get('/getCompanies', (req, res) => {
    // get companies data
    console.log('runned')
    Companies.find({}).
        populate("bank_id").
        exec(function (err, data) {
            // console.log('bank_id', data, err)
            res.json(data);
        });
})

router.get('/getCompanyByCode', (req, res) => {
    // get company data by its code
    console.log('runned')
    Companies.findOne({ company_code: req.query.code }).
        exec(function (err, data) {
            console.log('bank_id', data, err)
            res.json(data);
        });
})

router.post('/deleteCompany', (req, res) => {
    // deletes companys data
    const { _id } = req.body;
    // console.log('recorArr', req.body)
    Companies.findOneAndRemove({ company_code: _id }).then((data) => {
        console.log('del', data)
        data.remove()
        res.json(data);
    })
    .catch((err) => {
        console.log(err)
    });
})

module.exports = router;
