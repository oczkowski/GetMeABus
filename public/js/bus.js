//Listeners
$(document).on("click", ".stopEntity", function () {  //Listens for future elements
    var NaptanId = this.id;
    console.log("ARRIVALS FOR: " + NaptanId);//To be removed
    getArrivals(NaptanId).then(function (arr) { //Get bus arrivals for clicked bus stop
        console.log(arr);
    });
});

//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon) {
    //Request bus stop data
    var url = "/bus/stops/" + lat + "/" + lon;
    $.getJSON(url, function (data) {
        if (data) { //Check if any bus stops were found
            $("#stopsContainer").html("");
            data.forEach(function (stop) {
                $("#stopsContainer").append(
                    '<div class="ui vertical segment stopEntity" id="' + stop.naptanId + '">' +
                    '<p>' + stop.stopLetter + ' ' + stop.commonName + ' - ' + stop.towards + '</p>' +
                    '</div>'
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
            if (response) {
                $("#stopsContainer").html("");
                response.forEach((stop) => {
                    $("#stopsContainer").append(
                        '<div class="ui vertical segment" onclick="getNearbyBusStops(' + stop.lat + ', ' + stop.lon + ')">' +
                        '<p>' + stop.name + ' - ' + stop.lat + ', ' + stop.lon + '</p>' +
                        '</div>'
                    );//End of append
                });
            }
        });
    }
}

//Display data to user
