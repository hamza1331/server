const express = require('express');
const router = express.Router();
const Reciepts = require('./../models/newReciepts')
const Info = require('./../models/globalInfo')

console.log('Reciept page')
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.post('/upload', (req, res, err) => {
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

        Reciepts.findById(_id, (err, data) => {
            data.filePath = "/public/" + file.name;
            data.save()
        })

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});

router.get('/getRecieptInfo', (req, res) => {
    Info.find({}, 'reciept_info').exec(function (err, data) {
        console.log('data', data)
        res.json(data);
        if (err) {
            //manage error
        };
    });
})

router.post('/addReciept', (req, res) => {
    console.log('Add Reciept')

    console.log(req.body)
    req.body.recordArr.map(v => {
        if(v.payment_mode === "5d6ce0fd32fc741b5cac10d3") {
            // console.log(v)
            req.body['checkUniqueId'] = Math.random() * 10
        }
    })
    const Reciept = new Reciepts(req.body);
    Info.findByIdAndUpdate("5d6a2eeef7935f12787d9cc6", {
        $inc: {
            reciept_info: 1
        }
    }, (err, data) => {
        console.log('inc', err, data)

        Reciept.save().then(x => {
            res.json(x);
        }).catch(err => {
            console.log('err', err, 'Ohh Error')
            res.status(500).send('err', err)
        });
    })
})


router.get('/getReciepts', (req, res) => {
    let date = req.query.date;
    console.log('params', date)
    Reciepts.find({ date: date }, (err, data) => {

        console.log('data', data)
        if (err) {
            //manage error
            return;
        };
        res.json(data);
    })
    console.log('runned')
})

router.post('/addRecieptsArr', (req, res) => {
    console.log('Add Payments Arr')

    console.log(req.body)
    // const Payment = new Payments(req.body);
    const { _id, recordArr } = req.body;
    Reciepts.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.save().catch(err => {
            console.log('err', err)
            // res.status(500).send('err', err)
        });;
        res.json({ success: 'success' });

    });
})


router.post('/editReciepts', (req, res) => {
    console.log('Edit Reciepts Arr')
    console.log(req.body)

    const { _id, recordArr } = req.body;
    Reciepts.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.save();
        res.json(data);
    });
})


router.get('/getRecieptByRoundNo', (req, res) => {
    let record_no = req.query.record_no;
    console.log('params / uprecord_no', record_no)
    // let query = 

    Reciepts.findOne({ record_no: record_no }, (err, data) => {

        console.log('data', data)
        if (err) {
            //manage error
            return;
        };
        res.json(data);
    })

    console.log('runned')
})



router.get('/getRecieptById', (req, res) => {
    let id = req.query.id;
    console.log('params / uprecord_no', id)

    Reciepts.findById(id).
        populate("recordArr.party payment_mode").
        exec(function (err, data) {
            if (err) {
                console.log('err', err)
                return;
            }
            res.json(data);
        });

    console.log('runned')
})



module.exports = router;