const express = require('express');
const router = express.Router();

// const fs = require('fs');
// const path = require('path');
// const formidable = require('formidable');

const JJournals = require('./../models/Addjjournals')
const Info = require('./../models/globalInfo')

const fileUpload = require('express-fileupload');

// app.use(express.static('public'));
router.use(fileUpload());

router.get('/getJJournalInfo', (req, res) => {
    Info.find({}, 'jjournal_info').exec(function (err, data) {
        console.log('data', data)
        res.json(data);
        if (err) {
            //manage error
            console.log('err', err)
        };
    });
})


router.post('/addJJournals', (req, res) => {
    console.log('Add JJournals')

    console.log(req.body)
    const JJournal = new JJournals(req.body);
    Info.findByIdAndUpdate("5d6a2eeef7935f12787d9cc6", {
        $inc: {
            jjournal_info: 1
        }
    }, (err, data) => {
        console.log('inc', err, data)
        JJournal.save().then(x => {
            res.json(x);
        }).catch(err => {
            console.log('err', err)
            res.status(500).send('err', err)
        });
    })

})


router.get('/getJJournals', (req, res) => {
    let date = req.query.date;
    console.log('params / update', date)
    // let query = 

    JJournals.find({ date: date }, (err, data) => {

        console.log('data', data)
        if (err) {
            //manage error
            console.log('err', err)
            return;
        };
        res.json(data);
    })

    console.log('runned')
})

router.post('/addJJournalsArr', (req, res) => {
    console.log('Add JJournals Arr')
    const { _id, recordArr } = req.body;
    console.log('recorArr', recordArr)
    JJournals.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.save();
        res.json(data);
    });
})


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

        JJournals.findById(_id, (err, data) => {
            data.filePath = "/public/" + file.name;
            data.save()
        })

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});



router.post('/editJJournals', (req, res) => {
    console.log('Edit JJournals Arr')

    const { _id, recordArr, finalDebit, finalCredit } = req.body;
    console.log(req.body.finalCredit, req.body.finalDebit, 'obj')

    JJournals.findOne({ _id: _id }, function (err, data) {
        data.recordArr = recordArr;
        data.finalDebit = finalDebit;
        data.finalCredit = finalCredit
        data.save();
        res.json(data);
    });
})


router.get('/getJJournalByRoundNo', (req, res) => {
    let record_no = req.query.record_no;
    console.log('params / uprecord_no', record_no)
    // let query = 

    JJournals.findOne({ record_no: record_no }, (err, data) => {

        console.log('data', data)
        if (err) {
            //manage error
            return;
        };
        res.json(data);
    })

    console.log('runned')
})


router.get('/getJournalById', (req, res) => {
    let id = req.query.id;
    console.log('params / uprecord_no', id)
    // let query = 

    JJournals.findById(id).
    populate("recordArr.particulars").
    exec(function (err, data) {
        if(err) {
            console.log('err', err)
            return;
        }
        res.json(data);
    });

    console.log('runned')
})


module.exports = router;