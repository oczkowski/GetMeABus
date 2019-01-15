$(document).ready(function(){
    //Automatically getting the users location
    $("#getLocation").click(function(){
        var startPos;
        geoSuccess = function(position) {
            // Define user position
            startPos = position.coords;
            //Ask for stops nearby and display
            getNearbyBusStops(startPos.latitude, startPos.longitude);
        };
        //Error handling
        var geoError = function(error) {
            switch(error.code) {
            case error.TIMEOUT:
                // The user didn't accept the callout
                console.log("Could not determine location automatically. Please search for a locatin using the search box.")
                break;
            }
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    });

    //Get location using maps API

});//End of document