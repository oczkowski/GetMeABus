//Libraries
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
//APP
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended : true }));
    //Semantic-ui
    app.use(express.static(__dirname + "/semantic/dist"));
    //Public assets
    app.use(express.static(__dirname + "/public"));
    //Global middleware
    app.use(function(req, res, next){
        res.locals.errorCallback = function(err){
            console.log("ERROR: " + err); //TO BE REFACTORED
        };
        return next(); //It's a must
    });
//Routes
    var indexRoute = require("./routes/index"),
        busRoute = require("./routes/bus");
    app.use(busRoute);// "", prefix
    app.use(indexRoute);

//Web server
    var ip = process.env.IP || "0.0.0.0",
        port = process.env.PORT || 8000;

    app.listen(port, ip, function(){
        console.log("GetMeABus have started...");
    });