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
            return busData;
        }).catch(function(error){
            console.log("Error: " + error);
        });
    }
    //Functions
    function compare(a, b) {
        if (a.timeToStation < b.timeToStation)
            return -1;
        if (a.timeToStation > b.timeToStation)
            return 1;
        return 0;
    }      

module.exports = busArrivalsMw;