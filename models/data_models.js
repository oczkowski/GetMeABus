var data_models = {};

data_models.Arrival = function(busId, destination, stopCode, timeToStop, towards, Naptan_Atco){
    this.busId = busId;
    this.destination = destination;
    this.stopCode = stopCode;
    this.timeToStop = timeToStop;
    this.towards = towards;
    this.Naptan_Atco = Naptan_Atco;
    //Arrival seconds to minutes
    this.minToStop = Math.round(timeToStop/60);
    //Later buses array
    this.laterBuses = [];
}

data_models.BusStop = function(stop, Naptan_Atco){ //https://api.tfl.gov.uk/StopPoint/{id}
    this.Naptan_Atco = Naptan_Atco;
    this.commonName = stop.commonName;
    //Selecting the bus stop from children array
    if(stop.stopType === "NaptanOnstreetBusCoachStopPair"){ //If stop is a bus stop
        stop.children.forEach((child) => { //Loop through every child
            if(child.naptanId === Naptan_Atco){ //If child is the bus stop we're looking for, bind data.
                this.stopLetter = child.stopLetter
            }
        });
    }
}

module.exports = data_models;