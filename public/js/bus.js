//Listeners
$(document).on("click", ".stopEntity", function(){  //Listens for future elements
    var naptanId = this.id;
    console.log("ARRIVALS FOR: " + naptanId);
    getArrivals(naptanId).then(function(arr){ //Get bus arrivals for clicked bus stop
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
                        '<div class="ui vertical segment stopEntity" id="' + stop.Naptan_Atco + '">' + 
                            '<p>' + stop.Stop_Name + '</p>'+
                        '</div>'
                    );//End of append
                });//End of forEach
            } else {
                console.log('no buses found'); //NO BUSES FOUND
            }
        });
};

//Get arrivals for a bus stop
async function getArrivals(NaptanId){
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'NaptanId' : NaptanId });
    //Display data
    return busArrivalsData;
}

//Display data to user
