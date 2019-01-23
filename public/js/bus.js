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
                '<tr>' +
                '<td><div class="arrivalId">' + arrival.busId + '</div><div class="arrivalDest">' + arrival.destination + '</div></td>' +
                '<td class="arrivalTime">' + minToStop + '</br>' + nextBusStr + '</td>' +
                '</tr>'
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
                $("#stopsContainer").append(
                    '<tr id="' + stop.naptanId + '" class="stopEntity">' +
                    '<td><div class="stopLetter">' + stop.stopLetter + '</div>' + stop.commonName + '</td>' +
                    '<td>Towards ' + stop.towards + '</br> ' + stop.lines + '</td>' +
                    '</tr>'
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
                        '<tr onclick="getNearbyBusStops(' + stop.lat + ', ' + stop.lon + ')">' +
                        '<td><div class="stopLetter">+</div></td>' +
                        '<td>' + stop.name + '</td>' +
                        '<td>' + stop.lat + ', ' + stop.lon + '</td>' +
                        '</tr>'
                    );//End of append
                });
            }
        });
    }
}

//Display data to user
