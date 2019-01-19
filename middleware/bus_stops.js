//bus_stops.js return object
    var busStopMw = {};
//Libraries
    var axios = require("axios");
    require('dotenv').config();
    //Data models
    dm = require("../models/data_models");
    //Config
    const tflId = process.env.TFL_APP_ID;
    const tflKey = process.env.TFL_APP_KEY;
    
//Get's nearby stops
    busStopMw.getNearbyStops = async function(lati, long){
        range = Number(process.env.BUS_STOP_RANGE), //Show bus stops 1000 up down left and right
        limit = Number(process.env.BUS_STOP_LIMIT); //Bus stops limit from config

        var tflStopsResponse = await getStopsFromTfl(range, lati, long);
        tflStopsResponse = tflStopsResponse.data;

        //Check if any bus stops found
        if(tflStopsResponse.stopPoints.length > 0){
            //Get stops list
            var foundBusStops = tflStopsResponse.stopPoints;
            //Slice array to limit
            foundBusStops = foundBusStops.slice(0, limit);
            //Parse found bus stops
            foundBusStops = busStopsParser(foundBusStops);//centerPoint usage possibility
            //return nearbyStops;
            return foundBusStops;
        } else {
            return false;
        }
    }
//Parse bus stops data to busStop model
    function busStopsParser(busStops){
        let arr = [];
        busStops.forEach((stop) => {
            arr.push(new dm.BusStop(stop));
        });
        //Return parsed bus stops
        return arr;
    }

//TFL API
    function getStopsFromTfl(range, lati, long){
        let url = 'https://api.tfl.gov.uk/StopPoint';
        return axios.get(url, {
            params : {
                radius : range,
                stopTypes : 'NaptanBusCoachStation,NaptanPublicBusCoachTram',
                lat : lati,
                lon : long,
                app_id : tflId,
                app_key : tflKey
            }
        }).then((response) => {
            return response;
        }).catch((err) => console.log("ERROR: " + err));
    }

module.exports = busStopMw;