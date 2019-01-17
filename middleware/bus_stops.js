//bus_stops.js return object
    var busStopMw = {};
//Libraries
    var axios = require("axios"),
    csv = require("csvtojson"),
    sortByDistance = require('sort-by-distance');
//Reading bus stops file
    const busStopsFile = './bus-stops.csv';

//Search CSV file for nearby bus stops
busStopMw.getNearbyStops = async function(limit, lati, long){
    var loc = await getMyEastingNorthing(lati, long);
    loc = loc.data;
    var busStops = await csv().fromFile(busStopsFile);

    var meE = Number(loc.EASTING),
    meN = Number(loc.NORTHING),
    nearbyStops = [],
    range = 500; //Show bus stops 1000 up down left and right

    busStops.forEach(function(stop){
        var stopE = Number(stop.Location_Easting),
            stopN = Number(stop.Location_Northing);
            
        if(stopE >= (meE - range) && stopE <= (meE + range) && stopN >= (meN - range) && stopN <= (meN + range)){
            //Push near stop to array
            nearbyStops.push(stop);
        }
    });
    //Sort array by distance to origin
    nearbyStops = sortCoordinates(meE, meN, nearbyStops);
    //Slice array to limi
    nearbyStops = nearbyStops.slice(0, limit);
    //return nearbyStops;
    return Promise.resolve(nearbyStops);
}

//Long - Lati => British National Grid
function getMyEastingNorthing(lati, long){
    var url = 'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=LatLongToBNG&lat=' + lati + '&lon=' + long;
    return axios.get(url).then(function(response){
        return response;
    }).catch(function(error){
        console.log("Error: " + error);
    });
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
    return sortByDistance(origin, coords, opts);
}

module.exports = busStopMw;