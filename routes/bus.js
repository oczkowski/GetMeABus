//Libraries
    var express = require("express"),
        router = express.Router(),
        busStopMw = require("../middleware/bus_stops"),
        busArrivalMw = require("../middleware/bus_arrivals"),
        busSearchMw = require("../middleware/bus_search");

//Bus routes
    router.get("/bus", function(req, res){
        //getMeStopTimetable('490014872N');//TESTING 1 2 1 2
        res.render("bus");
    });
    router.get("/bus/stops/:lat/:lon", function(req, res){
        busStopMw.getNearbyStops(req.params.lat, req.params.lon).then((nearbyStops) => {
            res.json(nearbyStops);
        });
    });
    router.post("/bus/arrivals", function(req, res){
        busArrivalMw.getMeStopTimetable(req.body.naptanId).then((arrivals) =>{
            res.json(arrivals);
        });
    });
    router.get("/bus/stop/:value", function(req, res){
        busSearchMw.findStopsLocation(req.params.value).then((foundStops) => {
            res.json(foundStops);
        });
    });
//Return router
module.exports = router;