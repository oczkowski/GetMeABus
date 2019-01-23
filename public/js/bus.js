//Listeners
$(document).on("click", ".stopEntity", function () {  //Listens for future elements
    toggleLoader(true); //Start loading animation
    var NaptanId = this.id;
    getArrivals(NaptanId).then(function (arr) { //Get bus arrivals for clicked bus stop
        //console.log(arr) Testing
        $("#stopsContainer").html("");
        arr.forEach((arrival) => {
            var nextBusStr = "";
            arrival.laterBuses.length > 0 ? nextBusStr = '<small>Next in ' + arrival.laterBuses[0].minToStop + ' minutes</small>' : nextBusStr = "";
            var minToStop = "";
            arrival.minToStop == 0 ? minToStop = "<strong>Due</strong>" : minToStop = "<strong>" + arrival.minToStop + "</strong> <strong>min</strong>";
            $("#stopsContainer").append(
                '<div class="ui grid middle aligned arrivalEntity">' +
                '   <div class="four wide column"><div class="arrivalId">' + arrival.busId + '</div></div>' +
                '   <div class="seven wide column entityText">' + arrival.destination + '</div>' +
                '   <div class="five wide column arrivalTime">' + minToStop + '</br>' + nextBusStr + '</div>' +
                '</div>'
            );//End of append
        });
    });
    toggleLoader(false); //Stop loading animation
});

//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon) {
    //Toggle on loading animation
    toggleLoader(true);
    //Request bus stop data
    var url = "/bus/stops/" + lat + "/" + lon;
    $.getJSON(url, function (data) {
        //Toggle off loading animation
        toggleLoader(false);
        if (data) { //Check if any bus stops were found
            $("#stopsContainer").html("");
            data.forEach(function (stop) {
                var goingTowards;
                if(data.towards != undefined){
                    goingTowards = '<div class="five wide column towardsText">Towards <strong>' + stop.towards + '</strong></br> ' + stop.lines + '</div>'
                } else{
                    goingTowards = '<div class="five wide column towardsText">Towards <strong> Bus is not going anywhere </strong></br> stop.lines + </div>'
                }
                $("#stopsContainer").append(
                    '<div class="ui grid middle aligned stopEntity" id="' + stop.naptanId + '">' +
                    '   <div class="four wide column"><div class="stopLetter">' + stop.stopLetter + '</div></div>' +
                    '   <div class="seven wide column entityText"><strong>' + stop.commonName + '</strong></div>' +
                    goingTowards
                );//End of append
            });//End of forEach
        } else {
            $("#stopsContainer").innerHTML(
                '<div class="ui vertical segment"' +
                '<p>No bus stops found nearby</p>' +
                '</div>'
            );//End of append
        }
    });
};

//Get arrivals for a bus stop
async function getArrivals(naptanId) {
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'naptanId': naptanId });
    //Display data
    return busArrivalsData;
}

//Search for bus stop with input data passed from key listener in location.js
async function getBusStops(val) {
    if (val) {
        var url = "/bus/stop/" + val;
        $.getJSON(url, function (response) {
            //Toggle off loading
            toggleLoader(false);
            if (response) {
                $("#stopsContainer").html("");
                response.forEach((stop) => {
                    $("#stopsContainer").append(
                        '<div class="ui grid middle aligned searchEntity" onclick="getNearbyBusStops(' + stop.lat + ', ' + stop.lon + ')">' +
                        '   <div class="four wide column"><div class="stopLetter">+</div></div>' +
                        '   <div class="ten wide column entityText"><strong>' + stop.name + '</strong></div>' +
                        '</div>'
                    );//End of append
                });
            }
        });
    }
}

//Display data to user
