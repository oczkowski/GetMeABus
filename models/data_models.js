var data_models = {};

data_models.Arrival = function (busId, destination, stopCode, timeToStop, towards, naptanId) {
    this.busId = busId;
    this.destination = destination;
    this.stopCode = stopCode;
    this.timeToStop = timeToStop;
    this.towards = towards;
    this.naptanId = naptanId;
    //Arrival seconds to minutes
    this.minToStop = this.getMinToStop(timeToStop);
    //Later buses array
    this.laterBuses = [];
}
data_models.Arrival.prototype.getMinToStop = timeToStop => {
    return Math.round(timeToStop / 60);
}

data_models.BusStop = function (stop) { //https://api.tfl.gov.uk/StopPoint/{id}
    this.naptanId = stop.naptanId;
    this.commonName = stop.commonName;
    stop.stopLetter == undefined ? this.stopLetter = " " : this.stopLetter = stop.stopLetter; //If letter empty do not return undefined
    this.stopLetter = this.stopLetter.replace(/\W/g, ''); //Remove special characters
    this.status = stop.status;
    this.distance = stop.distance;
    this.lat = stop.lat;
    this.lon = stop.lon;
    //Setting the towards property
    this.towards = this.getTowardsProperty(stop);
    //Setting lines for stop in string format
    this.lines = this.getLinesForStop(stop);
}
data_models.BusStop.prototype.getTowardsProperty = stop => { //Getting the towards property
    let towards;
    stop.additionalProperties.forEach(child => {
        child.category === "Direction" && child.key === "Towards" ? towards = child.value : towards = false;
    });
    return towards;
}

data_models.BusStop.prototype.getLinesForStop = stop => {//Getting lines for stop in string format
    let arr = [];
    stop.lines.forEach((line) => {
        arr.push(line.id);
    });
    return arr.join(", ");//example 346, 735, 342
}

data_models.Search = function (searchRes) {
    this.name = searchRes.name;
    this.lon = searchRes.lon;
    this.lat = searchRes.lat;
}

module.exports = data_models;