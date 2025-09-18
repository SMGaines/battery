const PORT = 9999;

let express = require('express');

let app = express();

app.use('/js',express.static(__dirname + '/js'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

let batteries = require("./js/mongoBatteries.js");

const http = require("http");

let server = http.createServer({}, app).listen(PORT, () =>
{
    console.log('Listening on ' + server.address().port);
    batteries.initialise();
});

app.get('/',function(req,res)
{
    res.sendFile(__dirname + '/batteryPage2.html');
});

app.get('/insertBatteries',function(req,res)
{
    batteries.addBatteries();
});

app.get('/getBatteryList',async(req,res) =>
{
    const marka=req.query.marka; // n.p. marka ="Exide";
    console.log("server:getBatteryList: Marka="+marka);
    var batteryList= await batteries.getBatteryList(marka);
    res.send(batteryList);
});

app.get('/BuyBattery',function(req,res)
{
    const batteryID=req.query.id; 
    console.log("server:BuyBattery: ID="+batteryID);
    var errorCode=batteries.buyBattery(batteryID);
    res.send(errorCode);
});

app.get('/addBatteryType',function(req,res)
{
    res.sendFile(__dirname + '/batterySetup.html');
});

app.post('/addBatteryType', async (req, res) => 
{
    const {
    brand,
    price,
    available,
    length,
    width,
    height,
    ampere,
    amp
  } = req.body;
  var errorCode=await batteries.addBatteryType(brand, price, available, length, width, height, ampere, amp);
  console.log("addBatteryType: "+errorCode);
  if (errorCode==0)
    res.sendFile(__dirname + '/batteryTypeSuccess.html');
  else
     res.sendFile(__dirname + '/batteryTypeFail.html');
});