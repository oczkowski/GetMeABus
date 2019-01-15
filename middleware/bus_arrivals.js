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
            return response;
        }).catch(function(error){
            console.log("Error: " + error);
        });
    }

module.exports = busArrivalsMw;