const path = require('path')
const express = require('express');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fileUpload = require('express-fileupload');
// const blogController = require("./blogController");
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;

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


app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/blog.html'))
});

app.get('/blog-post?:id', (req, res) => {
  // res.send(req.params.id)
  res.sendFile(path.join(__dirname, '/public/blog-post.html'));
});

app.get('/blog-preview?:id', (req, res) => {
  // res.send(req.params.id)
  res.sendFile(path.join(__dirname, '/public/blog-preview.html'));
});

app.get('/blog/singlePost/:id', (req, res) => {
  fs.readFile(__dirname + '/public/assets/js/blog.json', (err, data) => {
    const posts = JSON.parse(data);
    let thisPost = {};
    for (const i in posts) {
      if (posts[i].id === req.params.id) {
        thisPost = posts[i];
      }
    }
    res.send(thisPost);
  })
});

app.post('/blog-preview', (req, res) => {
  fs.writeFile(__dirname + '/public/assets/js/blogPreview.json', JSON.stringify(req.body), function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200)
    }
  })
});


app.get('/blog/preview/:id', (req, res) => {
  fs.readFile(__dirname + '/public/assets/js/blogPreview.json', (err, data) => {
    console.log(data)
    const post = JSON.parse(data);
    res.send(post);
  })
});

app.post('/backend/pass', (req, res) => {
  var pass = Buffer.from(req.body.pass, 'base64').toString('ascii');
  if (pass == process.env.PASS) {
    res.send("true")
  } else {
    res.status(401).send("Sorry, not allowed")
  }
})

app.get('/backend/photos', (req, res) => {
  fs.readFile(__dirname + '/public/assets/js/currentStyles.json', (err, data) => {
    res.send(data)
  })
});

app.get('/backend/blog', (req, res) => {
  fs.readFile(__dirname + '/public/assets/js/blog.json', (err, data) => {
    res.send(data)
  })
})

app.post('/backend/blog', (req, res) => {
  fs.writeFile(__dirname + '/public/assets/js/blog.json', JSON.stringify(req.body), function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200)
    }
  })
})




app.post('/backend/deleteImg', (req, res) => {
  fs.unlink(__dirname + '/public' + req.body.src, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      fs.readFile(__dirname + '/public/assets/js/currentStyles.json', function (err, data) {
        var json = JSON.parse(data);
        var newJSON = json.filter((el, i) => {
          return i !== req.body.index
        })
        fs.writeFile(__dirname + '/public/assets/js/currentStyles.json', JSON.stringify(newJSON), function (err) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.sendStatus(200)
          }
        })
      })
    }
  })
})

app.post('/backend/newImgData', (req, res) => {
  var imgData = req.body.data;
  var index = req.body.index;

  fs.readFile(__dirname + '/public/assets/js/currentStyles.json', function (err, data) {
    var json = JSON.parse(data);
    json[index] = imgData;
    console.log(req.body)
    fs.writeFile(__dirname + '/public/assets/js/currentStyles.json', JSON.stringify(json), function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200)
      }
    })
  })
})

app.post('/backend/newPhoto', (req, res) => {
  var photo = req.files.photo;
  let type = req.body.type;
  let path = ""
  let jsonPath = "";

  var newData = {
    name: photo.name,
    size: '',
    path: photo.name,
    link: ''
  }

  if (type == "style") {
    path = "currentStyles";
  } else if (type == "blog") {
    path = "blogPics"
  }


  fs.writeFile(__dirname + '/public/assets/images/' + path + '/' + photo.name, photo.data, 'binary', function (err) {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    } else {
      console.log('File saved.')
      if (type == "style") {
        fs.readFile(__dirname + '/public/assets/js/' + path + '.json', function (err, data) {
          var json = JSON.parse(data)
          json.push(newData)
          fs.writeFile(__dirname + '/public/assets/js/' + path + '.json', JSON.stringify(json), function (err) {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200)
            }
          })
        })
      } else {
        res.sendStatus(200);
      }

    }
  })

})

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
}))

// Contact form submit functions. *** Need to update config ***
// ------------------------------------------------------------
app.post('/backend/contact-submit', (req, res) => {
  console.log('/contact-submit', req.body)
  var mailOptions = {
    from: process.env.EMAIL,
    to: process.env.MODE == "dev" ? 'red.kasid@gmail.com' : 'kalika.wrap@gmail.com',
    cc: process.env.MODE == "production" ? 'red.kasid@gmail.com' : '',
    subject: req.body.sub,
    text: req.body.message,
    replyTo: req.body.email
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ status: "error", error: error })
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ status: 'sent' })
    }
  });

})
// ------------------------------------------------------------

app.listen(port, () => {
  console.log(`${port} is the magic port`);
})
