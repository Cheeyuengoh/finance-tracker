import { MongoClient } from "mongodb";

const connectionString = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(connectionString);

let conn;
try{
    conn = await client.connect();
    console.log('Connected to MongoDB');
}catch(err){
    console.log(err);
}

const db = conn.db('FinanceTracker');

export default db;