//Listeners
$(document).on("click", ".stopEntity", function(){  //Listens for future elements
    var Naptan_Atco = this.id;
    console.log("ARRIVALS FOR: " + Naptan_Atco);
    getArrivals(Naptan_Atco).then(function(arr){ //Get bus arrivals for clicked bus stop
        console.log(arr);
    });
});

//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon){
    //Request bus stop data
        var url = "/bus/stops/" + lat + "/" + lon;
        $.getJSON(url , function(data){
            if(data){ //Check if any bus stops were found
                data.forEach(function(stop){
                    console.log(stop);
                    $("#stopsContainer").append(
                        '<div class="ui vertical segment stopEntity" id="' + stop.naptanId + '">' + 
                            '<p>' + stop.stopLetter + ' ' + stop.commonName + ' - ' + stop.towards + '</p>'+
                        '</div>'
                    );//End of append
                });//End of forEach
            } else {
                $("#stopsContainer").append(
                    '<div class="ui vertical segment"' + 
                        '<p>No bus stops found nearby</p>' +
                    '</div>'
                );//End of append
            }
        });
};

//Get arrivals for a bus stop
async function getArrivals(Naptan_Atco){
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'Naptan_Atco' : Naptan_Atco });
    //Display data
    return busArrivalsData;
}

//Display data to user
