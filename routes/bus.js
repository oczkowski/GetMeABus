//Libraries
    var express = require("express"),
        router = express.Router(),
        busStopMw = require("../middleware/bus_stops"),
        busArrivalMw = require("../middleware/bus_arrivals");

//Bus routes
    router.get("/bus", function(req, res){
        //getMeStopTimetable('490014872N');//TESTING 1 2 1 2
        res.render("bus");
    });
    router.get("/bus/stops/:lat/:lon", function(req, res){
        busStopMw.getNearbyStops(6, req.params.lat, req.params.lon).then(function(nearbyStops){
            res.json(nearbyStops);
        });
    });
    router.post("/bus/arrivals", function(req, res){
        busArrivalMw.getMeStopTimetable(req.body.NaptanId).then(function(arrivals){
            res.json(arrivals);
        });
    });
//Return router
module.exports = router;