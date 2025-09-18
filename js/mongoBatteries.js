const OK=0;
const ERROR_NO_SUCH_BATTERY=-1;
const ERROR_OUT_OF_STOCK=-2;

const sampleBatteries = [
      {id: 1,marka: "Exide",price: 100,available: 10,length: 5,width: 2,height: 1,amper: 2000,amp: 1.5},
      {id: 2,marka: "Bosch",price: 200,available: 20,length: 5,width: 2,height: 1,amper: 2000,amp: 1.5},
      {id: 3,marka: "Duracell",price: 150,available: 15,length: 5,width: 2,height: 1,amper: 1000,amp: 1.5},
];
// database, table, row, column, cell  = baza danych, tabela, wiersz, kolumna, komórka

require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

exports.initialise = async function() 
{

}

async function connect() 
{
    if (!db) 
    {
        try 
        {
            await client.connect();
            console.log("✅ Connected to MongoDB");
            db = client.db("Batteries"); // change if needed
        } 
        catch (err) 
        {
            console.error("❌ Failed to connect to MongoDB:", err);
        }
  }
  return db;
}

exports.getBatteryList = async function(marka) 
{
    try 
    {
        const db = await connect();
        const battery = db.collection("Battery");
        const results = await battery.find({ marka: marka }).toArray(); // JSON

        return results; // returns an array of matching documents
    } 
    catch (err) 
    {
        console.error("❌ Error fetching batteries:", err);
        throw err;
    }
};

exports.buyBattery = async function(anID) 
{
  try
  {
    const db = await connect();
    const battery = db.collection("Battery");
    // '$gte' znaczy '>='
    console.log("buyBattery: ID="+anID);
    let intID=parseInt(anID);
    //const result = await battery.updateOne({ "id": anID,"available": { $gte: 1 }  }, { $inc: { "available": -1 } } );
    const result = await battery.updateOne({ id: intID }, { $inc: { available: -1 } } );
  }
  catch (err) 
  {
        console.error("❌ Error buying batteries:", err);
        throw err;
  }
};

exports.addBatteryType=async function(brand, price, available, length, width, height, ampere, amp) 
{

}

exports.addBatteries=async function() 
{
    try
    {
        const db = client.db("Batteries"); // change if needed
        const batteries = db.collection("Battery");

        const result = await batteries.insertMany(sampleBatteries);
        console.log(`Inserted ${result.insertedCount} documents`);
    } 
    catch (err) 
    {
        console.error("❌ Error:", err);
    } 
}

exports.addBattery=async function(brand, price, available, length, width, height, ampere, amp) 
{
    try
    {
        const db = client.db("Batteries"); // change if needed
        const batteries = db.collection("Battery");

        const result = await batteries.insertOne();
        console.log(`Inserted ${result.insertedCount} documents`);
    } 
    catch (err) 
    {
        console.error("❌ Error:", err);
    } 
}