const path = require('path')
const express = require('express');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fileUpload = require('express-fileupload');
const fs = require('fs');
let photos = require(__dirname + '/photoList.json')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/backend', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/backend.html'))
})

app.get('/backend/photos', (req, res) => {
  res.send(photos)
})

app.post('/backend/deleteImg', (req, res) => {
  console.log(req.body)
  fs.unlink(__dirname + '/public' + req.body.src, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  })
})

app.post('/backend/pass', (req, res) => {
  var pass = Buffer.from(req.body.pass, 'base64').toString('ascii');
  if (pass == process.env.PASS) {
    res.send("true")
  } else {
    res.status(401).send("Sorry, not allowed")
  }
})

app.post('/backend/newPhoto', (req, res) => {
  var photo = req.files.photo;
  fs.writeFile(__dirname + '/public/currentStyles/' + photo.name, photo.data, 'binary', function (err) {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    } else {
      console.log('File saved.')
      res.sendStatus(200)
    }
  })
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
