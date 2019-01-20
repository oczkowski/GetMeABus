var busSearchMw = {}, //Return object
    dm = require("../models/data_models"),
    axios = require("axios");
    require('dotenv').config();
    //Config
    const tflId = process.env.TFL_APP_ID;
    const tflKey = process.env.TFL_APP_KEY;
    const searchLimit = process.env.SEARCH_LIMIT;
    //Functions
    busSearchMw.findStopsLocation = async function(value){
        var url = "https://api.tfl.gov.uk/Stoppoint/Search/" + value;
        var res =  await axios.get(url, {
            params: {
                app_id : tflId,
                app_key : tflKey
            }
        }).then((response) => {
            return response;
        });
        //Parse data
        res = res.data.matches;
        var arr = [];
        res.forEach(function(stop){
            arr.push(new dm.Search(stop));
        });
        //Search limit
        arr = arr.slice(0, searchLimit);
        //Return data
        return arr;
    }

module.exports = busSearchMw;