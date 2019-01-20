//bus_arrivals.js return object
    var busArrivalsMw = {};
    //Libraries
    var axios = require("axios");
    require('dotenv').config();
    //Data models
    dm = require("../models/data_models");
    //Config
    const tflId = process.env.TFL_APP_ID;
    const tflKey = process.env.TFL_APP_KEY;

    //TFL API
    busArrivalsMw.getMeStopTimetable = function(NaptanId){
        var url = 'https://api.tfl.gov.uk/StopPoint/' + NaptanId + '/Arrivals';
        return axios.get(url, {
            params: {
                app_id : tflId,
                app_key : tflKey
            }
        }).then((response) => {
            var busData = response.data.sort(compare); //Save only bus 'data' and sort by timeToStation
            busData = busArrivalsParser(busData); //Parse bus arrivals data to Arrival model and nest later buses
            return busData;
        }).catch(function(err){ console.log("ERROR: " + err) });
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
                newArr = new dm.Arrival(arrival.lineId, arrival.destinationName, arrival.platformName, arrival.timeToStation, arrival.towards, arrival.naptanId);
            //Add new object to the newArrivals array
            newArrivals.push(newArr);
        });
        //Nest later buses
        newArrivals = nestLaterBusArrivals(newArrivals);
        //Return new array of objects
        return newArrivals;
    }

    function nestLaterBusArrivals(arrivals){
        var arr = [];
        for(var i = 0; i < arrivals.length; i++){
            var doesExist = arr.findIndex(function(element){ //Find if exist and return index in of array
                return element.busId === arrivals[i].busId;
            });

            if(doesExist === -1){ //Parent bus does not yet exist
                arr.push(arrivals[i]);
            } else { //Parent bus found, nest into laterBuses array
                delete arrivals[i].laterBuses;
                arr[doesExist].laterBuses.push(arrivals[i]);
            };
        };
        return arr;
    };

module.exports = busArrivalsMw;