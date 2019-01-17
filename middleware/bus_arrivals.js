//bus_arrivals.js return object
    var busArrivalsMw = {};
    //Libraries
    var axios = require("axios");
    require('dotenv').config();
    //Config
    const tflApiString = '?app_id=' + process.env.TFL_APP_ID + '&app_key=' + process.env.TFL_APP_KEY;

    //TFL API
    busArrivalsMw.getMeStopTimetable = function(NaptanId){
        var url = 'https://api.tfl.gov.uk/StopPoint/' + NaptanId + '/Arrivals' + tflApiString;
        return axios.get(url).then(function(response){
            var busData = response.data.sort(compare); //Save only bus 'data' and sort by timeToStation
            busData = busArrivalsParser(busData); //Parse bus arrivals data to Arrival model and nest later buses
            console.log(busData);
            return busData;
        }).catch(function(error){
            console.log("Error: " + error);
        });
    }
    //Functions
    function compare(a, b) { //Sorting by timeToStation
        if (a.timeToStation < b.timeToStation)
            return -1;
        if (a.timeToStation > b.timeToStation)
            return 1;
        return 0;
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

module.exports = busArrivalsMw;