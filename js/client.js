const URL_GET_BATTERY_LIST = "/getBatteryList";

const OK=0;
const ERROR_NO_SUCH_BATTERY=-1;
const ERROR_OUT_OF_STOCK=-2;

const URL_BUY_BATTERY="/BuyBattery";

init = function() 
{
    console.log("Client: Initialising");
}

buyBattery = function(batteryID,batteryMarka) 
{
    let url = URL_BUY_BATTERY+"?id="+batteryID; 
    fetch(url).then(function(response)
    {
        return response.json();
    })
    .then(function(errorCode)
    {
        displayErrorMessage(errorCode);
        getBatteryList(batteryMarka);
    })
    .catch(function(err)
    {
        console.log('Fetch Error :-S', err);
    });
}

getBatteryList = function(marka) 
{
    let url = URL_GET_BATTERY_LIST+"?marka="+marka; 
    console.log("getBatteryList: "+url);
    fetch(url).then(function(response)
    {
        return response.json();
    })
    .then(function(data)
    {
        displayBatteryList(data);
    })
    .catch(function(err)
    {
        console.log('Fetch Error :-S', err);
    });
}

displayBatteryList=function(batteryData)
{
    var newRow,newCell;
    var batteryTable=document.getElementById("batteryTable");
    batteryTable.innerHTML="";
    addHeaderData(batteryTable);
    for (var i=0;i<batteryData.length;i++)
    {
        newRow=batteryTable.insertRow();

        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].marka;
        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].amper;
        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].amp;
        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].length+"x"+batteryData[i].width+"x"+batteryData[i].height;
        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].price;
        newCell=newRow.insertCell();
        newCell.innerHTML=batteryData[i].available;
        newCell=newRow.insertCell();
        newCell.innerHTML ='<button onclick="buyBattery('+batteryData[i].id + ', \'' +  batteryData[i].marka + '\')">Buy</button>';    
    }
}

addHeaderData=function(batteryTable)
{
    var newRow, newCell;
    newRow=batteryTable.insertRow();
    newCell=newRow.insertCell();newCell.innerHTML="Marka";
    newCell=newRow.insertCell();newCell.innerHTML="Amper";
    newCell=newRow.insertCell();newCell.innerHTML="Amp";
    newCell=newRow.insertCell();newCell.innerHTML="Size";
    newCell=newRow.insertCell();newCell.innerHTML="Price";
    newCell=newRow.insertCell();newCell.innerHTML="Available";
}

getBatteryData=function(b)
{
    return "<br>" + b.marka + "&nbsp;".repeat(5) + b.amper + "&nbsp;".repeat(5) + b.amp + 
        "&nbsp;".repeat(5) + b.length + "#" + b.width + "#" + b.height +
        "&nbsp;".repeat(5) + b.price + " zl" + "&nbsp;".repeat(10) +
        b.available + "pc" + "<br>" + "<br>";
}

getBanner=function()
{
   return "<br>".repeat(4)+'<span style="color:red;">Marka'+"&nbsp;".repeat(4)+"Ah"+"&nbsp;".repeat(6)+"A"+"&nbsp;".repeat(15)+"Size"+"&nbsp;".repeat(13)+"Price"+"&nbsp;".repeat(8)+'Available</span><br>';
}

displayData = function(text)
{
    document.getElementById('batteryData').innerHTML=text;
}

displayErrorMessage = function(errorCode)
{
    var errorMessage = "Battery purchased";
    if (errorCode == ERROR_NO_SUCH_BATTERY)
        errorMessage = "Unknown battery";
    if (errorCode == ERROR_OUT_OF_STOCK)
        errorMessage = "Out of Stock";
    document.getElementById('errorMessage').innerHTML=errorMessage;
}