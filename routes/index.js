//Libraries
    var express = require("express"),
    router = express.Router();

//Routes
    router.get("/", function(req, res){
        res.render("home");
    });

//Return router
module.exports = router;