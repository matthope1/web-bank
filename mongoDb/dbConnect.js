const { MongoClient, ServerApiVersion } = require('mongodb');
// TODO: change me before pushing to repo 
const pass = process.env.DBPASS || "" 

if (!pass) {
	console.log("could not build database connection string")
}

const uri = "mongodb+srv://root:" + pass + "@cluster0.1vieuux.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function connectDb() {

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const database = client.db("web_bank")
    // const users = await database.collection("users").find({}).toArray()
		// console.log("users from db connect", users)
    // console.log("returning client", client)
    return client

  } catch(err) {
		console.log("Error while trying to connect to database", err)
    throw err 
	}
}




module.exports = { connectDb };