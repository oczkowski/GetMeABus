//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon){
    //Request bus stop data
        var url = "/bus/stops/" + lat + "/" + lon;
        $.getJSON(url , function(data){
            data.forEach(function(stop){
                $("#stopsContainer").append(
                    '<div class="ui vertical segment stopEntity" id="' + stop.Naptan_Atco + '">' + 
                        '<p>' + stop.Stop_Name + '</p>'+
                    '</div>'
                );//End of append
            });
        });
};
//Listeners
$(document).on("click", ".stopEntity", function(){  //Listener for future elements
    var naptanId = this.id;
    console.log("ARRIVALS FOR: " + naptanId);
    getArrivals(naptanId).then(function(arr){
        console.log(arr);
    });
});

//Get arrivals for a bus stop
async function getArrivals(NaptanId){
    var url = "/bus/arrivals";
    var busArrivalsData = await $.post(url, { 'NaptanId' : NaptanId });
    //Display data
    return busArrivalsData;
}

//Display data to user