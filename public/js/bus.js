//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon){
    //Request bus stop data
        var url = "/bus/stops/" + lat + "/" + lon;
        $.getJSON(url , function(data){
            data.forEach(function(stop){
                $("#stopsContainer").append(
                    '<div class="ui vertical segment stopEntity" id="' + stop.Naptan_Atco + '">' + 
                        '<p>' + stop.Stop_Name + '</p>'+
                    '</div>'
                );//End of append
            });
        });
};
//Listeners
$(document).on("click", ".stopEntity", function(){  //Listener for future elements
    var naptanId = this.id;
    console.log("ARRIVALS FOR: " + naptanId);
    getArrivals(naptanId).then(function(arr){
        console.log(arr);
    });
});

//Get arrivals for a bus stop
async function getArrivals(NaptanId){
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'NaptanId' : NaptanId });
    busArrivalsData = busArrivalsParser(busArrivalsData);
    //Display data
    return busArrivalsData;
}

function busArrivalsParser(busArrivalsData){
    var newArrivals = [];
    busArrivalsData.forEach(function(arrival){
        //Parse only necessary data for each object
        var newArr = {};//New arrival object
            newArr = new Arrival(arrival.lineId, arrival.destinationName, arrival.platformName, arrival.timeToStation, arrival.towards, arrival.naptanId);
        //Add new object to the newArrivals array
        newArrivals.push(newArr);
    });
    //Nest later buses
        //newArrivals = nestLaterBusArrivals(newArrivals);
    //Return new array of objects
    return newArrivals;
}

function Arrival(busId, destination, stopCode, timeToStop, towards, NaptanId){
    this.busId = busId;
    this.destination = destination;
    this.stopCode = stopCode;
    this.timeToStop = timeToStop;
    this.towards = towards;
    this.NaptanId = NaptanId;
    //Arrival seconds to minutes
    this.minToStop = Math.round(timeToStop/60);
}

function nestLaterBusArrivals(arrivals){
    
};

//Display data to user