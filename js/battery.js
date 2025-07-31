exports.Battery = function(anID,aBrand,aPrice,numAvailable,length,width,height,amper,amp) 
{
    this.id = anID;
    this.marka = aBrand;
    this.price = aPrice;
    this.available = numAvailable;
    this.length = length;
    this.width = width;
    this.height = height;
    this.amper = amper;
    this.amp = amp;

    this.getID = function() { return this.id; }
    this.getMarka = function() { return this.marka; }
    this.getPrice = function() { return this.price; }
    this.getAvailable = function() { return this.available; }
    this.getLength = function() {return this.length; }
    this.getWidth = function() {return this.width; }
    this.getHeight = function() { return this.height; }
    this.getAmper = function() {return this.amper; }
    this.getAmp = function() { return this.amp; }
}