//Libraries
var express = require("express"),
    router = express.Router(),
    busStopMw = require("../middleware/bus_stops"),
    busArrivalMw = require("../middleware/bus_arrivals"),
    busSearchMw = require("../middleware/bus_search");

//Bus routes
router.get("/", function (req, res) {
    res.render("bus");
});
router.get("/stops/:lat/:lon", function (req, res) {
    busStopMw.getNearbyStops(req.params.lat, req.params.lon).then((nearbyStops) => {
        res.json(nearbyStops);
    });
});
router.post("/arrivals", function (req, res) {
    busArrivalMw.getMeStopTimetable(req.body.naptanId).then((arrivals) => {
        res.json(arrivals);
    });
});
router.get("/stop/:value", function (req, res) {
    busSearchMw.findStopsLocation(req.params.value).then((foundStops) => {
        res.json(foundStops);
    });
});
//Return router
module.exports = router;