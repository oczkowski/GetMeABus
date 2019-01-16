//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon){
    //Request bus stop data
        var url = "/bus/stops/" + lat + "/" + lon;
        $.getJSON(url , function(data){
            data.forEach(function(stop){
                $("#stopsContainer").append(
                    '<div class="ui vertical segment">' + 
                        '<p>' + Math.round(stop.distance) + ' - ' + stop.Stop_Name + '</p>'+
                    '</div>'
                );
            });
        });
};

//Get arrivals for a bus stop
async function getArrivals(NaptanId){
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'NaptanId' : NaptanId });
    //busArrivalsData = busArrivalsParser(busArrivalsData);
    return busArrivalsData;
}

function busArrivalsParser(busArrivalsData){
    var newArrivals = [];
    busArrivalsData.forEach(function(arrival){
        //Parse only necessary data for each object
        var newArr = {};//New arrival object
            newArr = new Arrival(arrival.lineId, arrival.destinationName, arrival.platformName, arrival.timeToStation, arrival.towards);
        //Add new object to the newArrivals array
        newArrivals.push(newArr);
    });
    //Nest later buses

    //Return new array of objects
    return newArrivals;
}

function Arrival(busId, destination, stopCode, timeToStop, towards){
    this.busId = busId;
    this.destination = destination;
    this.stopCode = stopCode;
    this.timeToStop = timeToStop;
    this.towards = towards;
}

//Display data to user