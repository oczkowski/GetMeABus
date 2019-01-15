//Get a list of bus stops nearby
function getNearbyBusStops(lat, lon){
    //Request bus stop data
        var url = "/bus/stops/" + lat + "/" + lon;
        $.getJSON(url , function(data){
            data.forEach(function(stop){
                $("#stopsContainer").append(
                    '<div class="ui vertical segment">' + 
                        '<p>' + Math.round(stop.distance) + ' - ' + stop.Stop_Name + '</p>'+
                    '</div>'
                );
            });
        });
};

//Get arrivals for a bus stop
async function getArrivals(NaptanId){
    var url = "/bus/arrivals";
    return await $.post(url, { 'NaptanId' : NaptanId });
}

//Display data to user