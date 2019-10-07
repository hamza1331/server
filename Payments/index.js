const express = require('express');
const router = express.Router();

const Payments = require('./../models/newPayments')
const Info = require('./../models/globalInfo')

const fileUpload = require('express-fileupload');
const ChecksInHands = require('../models/checkInHand')

router.use(fileUpload());

router.post('/upload', (req, res, err) => {
    // adds files to public folder
    let _id = req.query._id;
    console.log('err', err, req.files)

    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/../public/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send('err', err);
        }

        Payments.findById(_id, (err, data) => {
            data.filePath = "public/" + file.name;
            data.save()
        })

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});



router.get('/getPaymentInfo', (req, res) => {
    // get current record no for paymentss
    Info.find({}, 'payment_info').exec(function (err, data) {
        // console.log('data', data)
        res.json(data);
        if (err) {
            //manage error
        };
    });
})


router.post('/addPayments', (req, res) => {
    console.log('Add Payments')
        // adds new data and increments record nos 
    const Payment = new Payments(req.body);
    Info.findByIdAndUpdate("5d6a2eeef7935f12787d9cc6", {
        $inc: {
            payment_info: 1
        }
    }, (err, data) => {
        Payment.save().then(x => {
            res.json(x);
            req.body.recordArr.map(v => {
                if(v.payment_mode === "5d6ce0fd32fc741b5cac10d3") {
                    // console.log(v)
                    ChecksInHands.findOne({ _id: v.check_id }, function (err, data) {
                        data.used = true;
                        data.usedAgainst = v.party;
                        data.save();
                    });
                }
            })
        }).catch(err => {
            console.log('err', err)
            res.status(500).send(err)
        });
    })

})


router.get('/getPayments', (req, res) => {
    // get paymentss
    let date = req.query.date;

    Payments.find({ date: date }, (err, data) => {

        console.log('data', data)
        if (err) {
            return;
        };
        res.json(data);
    })

    console.log('runned')
})


router.post('/addPaymentsArr', (req, res) => {
    // adds neew rows to voucher
    const { _id, recordArr } = req.body;
        // console.log('Add Payments Arr', req.body)

    Payments.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.save();
        res.json(data);
    }).catch(err => {
        console.log('err', err)
        res.status(500).send(err)
    });
})


router.post('/editPayments', (req, res) => {
    console.log('Edit Payments Arr')
    // console.log(req.body)
// edits payment form
    const { _id, recordArr } = req.body;
    Payments.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.save();
        res.json(data);
    });
})


router.get('/getPaymentByRoundNo', (req, res) => {
    // get data by record nos
    let record_no = req.query.record_no;
    Payments.findOne({ record_no: record_no }, (err, data) => {

        // console.log('data', data)
        if (err) {
            //manage error
            return;
        };
        res.json(data);
    })

    console.log('runned')
})


module.exports = router;
