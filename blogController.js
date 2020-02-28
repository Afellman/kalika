const MongoClient = require('mongodb').MongoClient
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/";
let ObjectId = require('mongodb').ObjectID;
let db;

MongoClient.connect(MONGODB_URI, (err, client) => {
  if (err) return console.log(err)
  db = client.db('kalika') // whatever your database name is
})

module.exports = {
  saveOne: (req, res) => {
    if (!db) res.send({ error: "Database Error" })
    db.collection(req.body.collection)
      .save(req.body.newBatch, (err, result) => {
        if (err) res.send({ error: "Database Error" })
        else res.send(result)
      })
  },
  deleteOne: (req, res) => {
    if (!db) res.send({ error: "Database Error" })
    db.collection(req.body.collection)
      .deleteOne({ '_id': ObjectId(req.body.id) }, (err, result) => {
        if (err) res.send({ error: "Database Error" })
        else res.send(result)
      })
  },
  updateOne: (req, res) => {
    if (!db) res.send({ error: "Database Error" })
    db.collection('blog').update({ '_id': req.body.id }, (err, result) => {
      if (err) res.send({ error: "Database Error" })
      else res.send(result);
    })
  },
  getAll: (req, res) => {
    if (!db) res.send({ error: "Database Error" })
    db.collection('blog').find({}).toArray((error, documents) => {
      if (error) res.send({ error: "Database Error" })
      else res.send(documents);
    })
  }
}


