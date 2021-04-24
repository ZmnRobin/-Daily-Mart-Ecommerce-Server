const express = require('express')
const app = express()
const cors=require('cors');
const bodyParser=require('body-parser');
const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('This is Daily-Mart-Server responding to you....!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cigf8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  const collection = client.db("DailyMart").collection("Products");
  const orderCollection = client.db("DailyMart").collection("Orders");

  app.post('/addProduct',(req,res)=>{
    const newProduct=req.body;
    collection.insertOne(newProduct)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })
  
  app.get('/allProducts',(req,res)=>{
    collection.find()
    .toArray((err,products)=>{
      res.send(products)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const newProduct=req.body;
    orderCollection.insertOne(newProduct)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/orderList',(req,res)=>{
    orderCollection.find({email:req.query.email})
    .toArray((err,products)=>{
      res.send(products)
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })

});

app.listen(process.env.PORT || port)