//Libraries
var express = require("express"),
    app = express(),
    csv = require("csvtojson"),
    axios = require("axios");
//Require configuration variables
    require('dotenv').config();
    const tflApiString = '?app_id=' + process.env.TFL_APP_ID + '&app_key=' + process.env.TFL_APP_KEY;
//Reading bus stops file
    const busStopsFile = './bus-stops.csv';
//EXAMPLE LAT LON
    const meLat = '51.540686799999996';
    const meLon = '0.19573269999999998';
//APP
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
//Routes
    app.get("/", function(req, res){
        res.render("home");
    });
    app.get("/bus", function(req, res){
        //getMeStopTimetable('490014872N');//TESTING 1 2 1 2
        getNearbyStops(5).then(function(nearbyStops){
            res.render("bus", { stopsNearby : nearbyStops });
        });
    });

//Functions
    function getMyEastingNorthing(lati, long){
        var url = 'https://www.bgs.ac.uk/data/webservices/CoordConvert_LL_BNG.cfc?method=LatLongToBNG&lat=' + lati + '&lon=' + long;
        return axios.get(url).then(function(response){
            return response;
        }).catch(function(error){
            console.log("Error: " + error);
        });
    }

    async function getNearbyStops(limit){
        var loc = await getMyEastingNorthing(meLat, meLon);
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
                //ADD SORTING BY DISTANCE

                //Push near stop to array
                nearbyStops.push(stop);
            }
        });
        //Slice array to limi
        nearbyStops = nearbyStops.slice(0, limit)
        //return nearbyStops;
        return Promise.resolve(nearbyStops);
    }
    //Get timetable for a bus stop from an API
    async function getMeStopTimetable(stopID){
        var url = 'https://api.tfl.gov.uk/StopPoint/' + stopID + '/Arrivals' + tflApiString;
        return axios.get(url).then(function(response){
            console.log(response)
            return response;
        }).catch(function(error){
            console.log("Error: " + error);
        });
    }

//Web server
    var ip = process.env.IP || "0.0.0.0",
        port = process.env.PORT || 8000;

    app.listen(port, ip, function(){
        console.log("GetMeABus have started...");
    });