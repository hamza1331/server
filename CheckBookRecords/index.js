const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

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

    Checks.find({used: undefined},(err, data) => {
            if (err) {
                console.log("error", err)
                return;
            };
            res.json(data);
        }).catch(err => {
            console.log('err', err)
        });
})


router.post('/editBook', (req, res) => {

    let {_id , last_used_check, cheque_no_end} = req.body;

    Checks.findById(_id,(err, data) => {
      console.log(data, 'data')
          if(data) {
            if(last_used_check === cheque_no_end) {
              data.used = true;
            }
            data.last_used_check = last_used_check;
            data.save()
          }
          res.json(data);
        }).catch(err => {
            console.log('err', err)
        });
})


module.exports = router;
