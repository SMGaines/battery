var b = require("./battery.js");

const BATTERY_PREFIX="Battery:";
const BATTERIES_DB_FILENAME = "batteries.db";
const BATTERY_FIELD_DELIMITER = ",";

const OK=0;
const ERROR_NO_SUCH_BATTERY=-1;
const ERROR_OUT_OF_STOCK=-2;

let batteries = [];

var batteryPath;

exports.initialise = function(baseDirectory) 
{
    console.log("Initialise: " + baseDirectory);
    batteryPath=baseDirectory + "/" + BATTERIES_DB_FILENAME;
    readBatteryData(batteryPath);
}

exports.getBatteryList = function(aMarka) 
{
  var markaBatteries=[];
  for (var i=0;i<batteries.length;i++)
  {
    if (batteries[i].marka==aMarka)
      markaBatteries.push(batteries[i]);
  }
  return markaBatteries;
}

exports.buyBattery=function(anID)
{
  var b = getBattery(anID);

  if (b == null)
    return ERROR_NO_SUCH_BATTERY;

  if (b.available == 0)
    return ERROR_OUT_OF_STOCK;

  b.available--;
  saveBatteryData(batteryPath);
  return OK;
}

getBattery=function(anID) 
{
  for (var i=0;i<batteries.length;i++)
  {
    if (batteries[i].id==anID)
      return batteries[i];
  }
  return null;
}

saveBatteryData=function(aPath)
{
  const fs =  require('fs');
  var stream = fs.createWriteStream(aPath);
  stream.once('open', function(fd) 
  {
      for (var i=0;i<batteries.length;i++)
      {
        var oLine=BATTERY_PREFIX+
                  batteries[i].id+BATTERY_FIELD_DELIMITER+
                  batteries[i].marka+BATTERY_FIELD_DELIMITER+
                  batteries[i].price+BATTERY_FIELD_DELIMITER+
                  batteries[i].available+BATTERY_FIELD_DELIMITER+
                  batteries[i].length+BATTERY_FIELD_DELIMITER+
                  batteries[i].width+BATTERY_FIELD_DELIMITER+
                  batteries[i].height+BATTERY_FIELD_DELIMITER+
                  batteries[i].amper+BATTERY_FIELD_DELIMITER+
                  batteries[i].amp;

        stream.write(oLine+"\n");
      }
      stream.end();
  });
}

readBatteryData=function(aPath)
{
  console.log("readBatteryData: ["+aPath+"]");
  var lineReader = require('readline').createInterface({ input: require('fs').createReadStream(aPath)});
  batteries=[];
  newBattery=null;
  lineReader.on('line', function (line) 
  {
    parseBatteryLine(line);
  });

  lineReader.on('close', function () 
  {
    console.log("readBatteryData: Batteries Loaded: "+batteries.length);
  });
}

parseBatteryLine=function(line)
{
  if (line.startsWith(BATTERY_PREFIX))
  {
    var batteryString=line.substring(BATTERY_PREFIX.length);
    var tokens=batteryString.split(BATTERY_FIELD_DELIMITER); 
    // tokens[0] is the ID
    let newBattery=new b.Battery(tokens[0],tokens[1],tokens[2],tokens[3],tokens[4],tokens[5],tokens[6],tokens[7],tokens[8]);
    batteries.push(newBattery);
  }
}