const express = require("express");
const cors = require("cors");
const { query } = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvjwpo8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("Fruitify").collection("Inventory");

    //get products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //post products
    app.post("/products",async(req,res)=>{
      const newProduct = req.body;
      result = await productCollection.insertOne(newProduct);
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

app.listen(port, () => {
  console.log("Listening at port", port);
});
