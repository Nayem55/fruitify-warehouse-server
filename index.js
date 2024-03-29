const express = require("express");
const cors = require("cors");
const { query } = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvjwpo8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect((err)=>{
      app.listen(port, () => {
        console.log("Listening at port", port);
      });
    });
    const productCollection = client.db("Fruitify").collection("Inventory");

    //get products
    app.get("/products", async (req, res) => {
      const query = {email:req.query?.email};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //post products
    app.post("/products",async(req,res)=>{
      const newProduct = req.body;
      result = await productCollection.insertOne(newProduct);
    })
    //update products
    app.put("/products",async(req,res)=>{
      const editedProduct = req.body;
      const id = editedProduct._id;
      const filter = { _id : ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: editedProduct.title,
          img: editedProduct.img,
          stock: editedProduct.stock,
          price:editedProduct.price,
          email:editedProduct.email
        }
     };
     const result = await productCollection.updateOne(filter, updatedDoc ,options);
     res.send(result)
      
    })

    //delete cart product
    app.delete('/products' , async(req,res)=>{
      const id = req.body._id;
      const query = {_id:ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result)
    })

  }
  
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fruitify server running");
});
