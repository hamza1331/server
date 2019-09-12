const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
var bodyParser = require('body-parser')
const db = require('./config/db');
const cors = require('cors')
const SECRET_KEY = 'hello world';
const fs = require('fs')

const AccNos = require('./models/AddAccNo');
const Info = require('./models/globalInfo');

// const Accounts = require('./models/AddAccounts');
// const mongoose = require('mongoose');


app.get('/getPdf', function (req, res) {
  var filePath = "/public/book.pdf";

  fs.readFile(__dirname + filePath, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
});


var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain);
app.use(bodyParser.json())

app.use(cors());

db.connection.once('open', () => console.log("connected to db")).on("error", (err) => console.log("error connecting db -->", err))



// Login and Verification Work

app.post('/login', function (req, res) {
  const { email, pass } = req.body;
  console.log('**', email, pass)
  if (Boolean(email) && Boolean(pass)) {
    // check email and pass in db
    if (email == 'admin' && pass == 'admin') {
      // this if contain the db check, if it is true then execute 
      jwt.sign({ email, pass }, SECRET_KEY, (err, token) => {
        if (err) {
          console.log("!!!!!!!!!", err)
          // res.sendStatus(403)
        } else {
          res.json({ token });
        }
      })
    }
    else {
      res.json("Wrong Credentials");
    }
  }
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    // jwt.verify(bearerToken,SECRET_KEY,(err,auth)=>{
    //   console.log('#######')
    //   if(err) res.sendStatus(403);
    //   else if (Boolean(auth.email) && Boolean(auth.pass)) next();
    //   else res.sendStatus(403);
    // });
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
module.exports = verifyToken;

app.use('/ChartOfAccounts', verifyToken, require('./ChartOfAccounts/index'))


app.use('/payments', verifyToken, require('./Payments/index'))
app.use('/reciepts', verifyToken, require('./Reciepts/index'))
app.use('/jjournals', verifyToken, require('./JJournals/index'))

app.use('/checks', verifyToken, require('./CheckBookRecords/index'))
app.use('/checksInHand', verifyToken, require('./CheckInHands/index'))
app.use('/ledger', verifyToken, require('./newLedger/index'))
app.use('/trial', require('./TrailBalance/index'))

app.listen(process.env.PORT || 5000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


app.get('/getAcc_nos', (req, res) => {

  AccNos.find({}, (err, data) => {
    if (err) {
      //manage error
      console.log('err', err)
      return;
    };
    res.json(data);
    console.log('data', data)
  })
})


app.post('/addAccNos', (req, res) => {
  const AccNo = new AccNos(req.body);
  console.log(req.body)
  AccNo.save()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    })
})

app.get('/', (req, res) => {

  console.log('Server Running!!')
})


app.post('/addInfo', (req, res) => {
  const Infos = new Info({
    payment_info: 1,
    reciept_info: 1,
    jjournal_info: 1
  });
  Infos.save().then(data => {
    res.json(data);
  }).catch(err => {
    console.log('err', err)
    // res.status(500).send('err', err)
  });
})