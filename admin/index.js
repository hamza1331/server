const express = require('express');
const router = express.Router();

const Info = require('./../models/globalInfo');


router.get('/getSoftwareName', (req, res) => {
    Info.find({}, 'software_name').exec(function (err, data) {
        console.log('data', data)
        res.json(data);
        if (err) {
            console.log('err', err)
        };
    });
})


router.post('/editSoftWareName', (req, res) => {
    const { software_name } = req.body;
    console.log('recorArr', req.body)
    Info.findOne({_id: '5d6a2eeef7935f12787d9cc6'}, function (err, data) {
        data.software_name = software_name;
        data.save();
        res.json(data);
    });
})


router.get('/getSoftwareDate', (req, res) => {
    Info.find({}, 'software_date').exec(function (err, data) {
        console.log('data', data)
        res.json(data);
        if (err) {
            console.log('err', err)
        };
    });
})


router.post('/editSoftWareDate', (req, res) => {
    const { software_date } = req.body;
    Info.findOne({_id: '5d6a2eeef7935f12787d9cc6'}, function (err, data) {
        data.software_date = software_date;
        data.save();
        res.json(data);
    });
})

module.exports = router;
