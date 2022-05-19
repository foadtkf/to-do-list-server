const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// paste the "full driver code example" from mongodb connect to cluster

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq6of.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("todos").collection("task_list");
    console.log("Connected");    
    app.get("/tasks", async (req, res) => {
      console.log("query", req.query);
      const query = {};
      const cursor = productCollection.find(query);
      
      let products;
        products = await cursor.toArray();
      res.send(products);
    });
    // add products
    app.post("/tasks", async (req, res) => {
        const newTask = req.body;
        const result = await  productCollection.insertOne(newTask);
        res.send(result);
      });
    app.delete("/tasks/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      });
      app.put('/tasks/:id',async(req,res)=>{
        const id=req.params.id
        const updatedProduct=req.body
        const filter ={_id:ObjectId(id)}
        const options = { upsert: true }
        const updatedDoc={
          $set:{
            task: updatedProduct.task
          }
        }
        const result=await productCollection.updateOne(filter,updatedDoc,options)
        res.send(result)
      })
} finally {
}
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("laptopdokan server is running");
  });
  app.listen(port, () => {
    console.log("it is running on ", port);
  });
  // error occured again
