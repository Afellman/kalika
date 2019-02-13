const path = require('path')
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/backend', (req, res) => {
  res.sendFile(__dirname + '/public/backend.html');
})

app.post('/backend/pass', (req, res) => {
  var buf = Buffer.from(req.body.pass, 'base64').toString('ascii');
  if (buf == "smile") {
    res.send("true")
  } else {
    res.status(401).send("Sorry, not allowed")
  }
})

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: 'kalikadev@gmail.com',
    pass: 'password123'
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
