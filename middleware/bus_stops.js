//bus_stops.js return object
    var busStopMw = {};
//Libraries
    var axios = require("axios"),
    csv = require("csvtojson"),
    sortByDistance = require('sort-by-distance');
    require('dotenv').config();
    //Data models
    dm = require("../models/data_models");
    //Config
    const tflApiString = '?app_id=' + process.env.TFL_APP_ID + '&app_key=' + process.env.TFL_APP_KEY;
//Reading bus stops file
    const busStopsFile = './bus-stops.csv';

//Search CSV file for nearby bus stops
busStopMw.getNearbyStops = async function(lati, long){
    var loc = await getMyEastingNorthing(lati, long);
    loc = loc.data;
    var busStops = await csv().fromFile(busStopsFile);

    var meE = Number(loc.EASTING),
    meN = Number(loc.NORTHING),
    nearbyStops = [],
    range = Number(process.env.BUS_STOP_RANGE), //Show bus stops 1000 up down left and right
    limit = Number(process.env.BUS_STOP_LIMIT); //Bus stops limit from config

    busStops.forEach(function(stop){//TO BE REFACTORED
        var stopE = Number(stop.Location_Easting),
            stopN = Number(stop.Location_Northing);
            
        if(stopE >= (meE - range) && stopE <= (meE + range) && stopN >= (meN - range) && stopN <= (meN + range)){
            //Push near stop to array
            nearbyStops.push(stop);
        }
    });
    //Check if any bus stops found
    if(nearbyStops.length > 0){
        //Sort array by distance to origin
        nearbyStops = sortCoordinates(meE, meN, nearbyStops);
        //Slice array to limit
        nearbyStops = nearbyStops.slice(0, limit);
        //Translate to TFL bus stops
        nearbyStops = await getStopsFromTfl(nearbyStops);
        var nearbyStops = await Promise.all(nearbyStops).then((values) => { return values; })
        //return nearbyStops;
        return nearbyStops;
    } else {
        return false;
    }
}

//Long - Lati => British National Grid
function getMyEastingNorthing(lati, long){
    var url = 'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=LatLongToBNG&lat=' + lati + '&lon=' + long;
    return axios.get(url).then(function(response){
        return response;
    }).catch(function(err){ console.log("ERROR: " + err) });
}
//Sort by coordinates
function sortCoordinates(meE, meN, coords){
    var origin = { //Orygin point
        Location_Easting : meE,
        Location_Northing : meN
    };
    var opts = { //Custom coordinate names
        xName : 'Location_Easting',
        yName : 'Location_Northing'
    }
    return sortByDistance(origin, coords, opts); //Sort by distance package
}

//TFL API
function getStopsFromTfl(busStops){
    let arr = [];
    busStops.forEach(function(data){
        let url = 'https://api.tfl.gov.uk/StopPoint/' + data.Naptan_Atco + tflApiString;
        arr.push(
            axios.get(url).then(function(response){
                return new dm.BusStop(response.data, data.Naptan_Atco);
            }).catch(function(err){ console.log("ERROR: " + err) })
        );
    });
    return arr;
}

module.exports = busStopMw;