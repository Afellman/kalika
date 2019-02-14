const path = require('path')
const express = require('express');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/backend', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/backend.html'))
})

app.post('/backend/pass', (req, res) => {
  var pass = Buffer.from(req.body.pass, 'base64').toString('ascii');
  if (pass == process.env.PASS) {
    res.send("true")
  } else {
    res.status(401).send("Sorry, not allowed")
  }
})

app.get('/backend/allNames', (req, res) => {
  fs.readdir(path.join(__dirname, '/public/currentStyles'), (err, items) => {
    var fileArray = [];
    for (var i = 0; i < items.length; i++) {
      fileArray.push(items[i]);
    }
    res.send(fileArray)
  });
})

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
}))

// Contact form submit functions. *** Need to update config ***
// ------------------------------------------------------------
app.post('/contact-submit', (req, res) => {
  console.log('/contact-submit', req.body)
  //   var mailOptions = {
  //     from: 'hummoscontactus@gmail.com',
  //     to: 'hummos1985@gmail.com',
  //     cc: 'andrewfellman@abrahamsnatural.com',
  //     subject: req.body.subject,
  //     text: req.body.message,
  //     replyTo: req.body.email
  //   };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
  //   console.log(req.body)
  //   res.end('Submitted')
})
// ------------------------------------------------------------

app.listen(port, () => {
  console.log(`${port} is the magic port`);
})
