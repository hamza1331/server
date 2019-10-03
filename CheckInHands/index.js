const express = require('express');
const router = express.Router();

const ChecksInHands = require('../models/checkInHand')


router.post('/addChecksInHands', (req, res) => {
    const Check = new ChecksInHands(req.body);
    console.log(Check);
    Check.save().then(data => {
        res.json(data);
    }).catch(err => {
        console.log('err', err)
    });
})



router.get('/getChecksInHands', (req, res) => {

    ChecksInHands.find({used: false}, (err, data) => {
        if (err) {
            console.log("error", err)
            return;
        };
        res.json(data);
    }).catch(err => {
        console.log('err', err)
    });
})

router.post('/editChecks', (req, res) => {
    const { check_id, used, usedAgainst } = req.body;
    // console.log('recorArr', req.body)
    ChecksInHands.findOne({ _id: check_id }, function (err, data) {
        data.used = used;
        data.usedAgainst = usedAgainst;
        data.save();
        res.json(data);
    });
})

router.post('/deleteChecks', (req, res) => {
    const { check_id } = req.body;
    // console.log('recorArr', req.body)
    ChecksInHands.findOneAndRemove({ checkUniqueId: check_id }).then((data) => {
        console.log('del', data)
        data.remove()
        res.json(data);
    })
    .catch((err) => {
        console.log(err)
    });
})


module.exports = router;
