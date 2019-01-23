var data_models = {};

data_models.Arrival = function (busId, destination, stopCode, timeToStop, towards, naptanId) {
    this.busId = busId;
    this.destination = destination;
    this.stopCode = stopCode;
    this.timeToStop = timeToStop;
    this.towards = towards;
    this.naptanId = naptanId;
    //Arrival seconds to minutes
    this.minToStop = Math.round(timeToStop / 60);
    //Later buses array
    this.laterBuses = [];
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
    //Getting the towards property
    stop.additionalProperties.forEach((child) => {
        if (child.category === "Direction" && child.key === "Towards") this.towards = child.value;
    });
    //Getting lines for stop in string format
    let arr = [];
    stop.lines.forEach((line) => {
        arr.push(line.id);
    });
    this.lines = arr.join(", ");//example 346, 735, 342
}

data_models.Search = function (searchRes) {
    this.name = searchRes.name;
    this.lon = searchRes.lon;
    this.lat = searchRes.lat;
}

module.exports = data_models;