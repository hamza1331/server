const express = require('express');
const router = express.Router();

const Checks = require('../models/CheckBookRecords')


router.post('/addChecks', (req, res) => {
    const Check = new Checks(req.body);
    console.log(Check);
    Check.save().then(data => {
        res.json(data);
    }).catch(err => {
        console.log('err', err)
    });
})



router.get('/getChecks', (req, res) => {

    Checks.find({},(err, data) => {
            if (err) {
                console.log("error", err)
                return;
            };
            res.json(data);
        }).catch(err => {
            console.log('err', err)
        });
})


router.get('/editBook', (req, res) => {
    let {_id , last_used_check} = req.query;
    Checks.findOne({_id: _id},(data) => {
            data.last_used_check = last_used_check;
            data.save()
            res.json(data);
        }).catch(err => {
            console.log('err', err)
        });
})


module.exports = router;
