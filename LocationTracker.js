window.onload = init;

// location 
var latitude, longitude;

// Google map
var map = null;

// Path
var path = [];

var lastMarker = null;

//Watch Id and counter
var counter = 0;



// register the event handler for the button

function init() {
    //Check if the golocation API is avaliable 
    if (navigator.geolocation) {
        var startButton = document.getElementById("startButton");
        startButton.onclick = getLocation;
    } else {
        document.getElementById("status").innerHTML =
       "Geolocation support is not available."
    }

}

var getLocation = function () {
    // asynchronous call with callback success, 
    // error functions and options specified
    var options = {
        enableHighAccuracy : true,
        timeout : 50000,
        maximumAge : 0
    };
    
    navigator.geolocation.getCurrentPosition(
        displayLocation, handleError, options);
}

function displayLocation(position) {

    //After Start button clicked, it will be disabled
    document.getElementById("startButton").disabled = true;

    //Set the default counter equal to 1
    counter = 1;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

   //write all location information
    document.getElementById("counter").innerHTML =
          "Update#: " + counter;
    document.getElementById("latitude").innerHTML = 
            "Start Latitude: " + latitude;
    document.getElementById("longitude").innerHTML = 
            "Start Longitude: " + longitude;
    document.getElementById("Clatitude").innerHTML =
       "Current Latitude: " + latitude;
    document.getElementById("Clongitude").innerHTML =
            "Current Longitude: " + longitude;
    //create undateMylocation function with a setInterval method to automatically generate location information by 5 seconds each time.
    updateMyLocation = setInterval(function () {
        showSamplePath();
        counter++;
        document.getElementById("counter").innerHTML =
          "Update#: " + counter;
    }, 5000);
    // Show the google map with the position  
    showOnMap(position.coords);
}

// Exception handler
function handleError(error) {
    switch(error.code) {
        case 1:
            updateStatus("The user denied permission");
            break;
        case 2:
            updateStatus("Position is unavailable");
            break;
        case 3:
            updateStatus("Timed out");
            break;
    }
}

function updateStatus(message) {
    document.getElementById("status").innerHTML = 
        "<strong>Error</strong>: " + message;
}

// initialize the map and show the position
function showOnMap(pos) {
    
    var googlePosition = 
        new google.maps.LatLng(pos.latitude, pos.longitude);
    
    var mapOptions = {
        zoom: 15,
        center: googlePosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var mapElement = document.getElementById("map");
    map = new google.maps.Map(mapElement, mapOptions);
    
    // add the marker to the map
    var title = "Location Details";
    var content = "Lat: " + pos.latitude + 
                    ", Long: " + pos.longitude;
                    
    addMarker(map, googlePosition, title, content);
}

// add position marker to the map
function addMarker(map, latlongPosition, title, content) {
   
    var options = {
        position: latlongPosition,
        map: map,
        title: title,
        clickable: true
    };
    var marker = new google.maps.Marker(options);

    var popupWindowOptions = {
        content: content,
        position: latlongPosition
    };

    var popupWindow = new google.maps.InfoWindow(popupWindowOptions);

    google.maps.event.addListener(marker, 'click', function() {
        popupWindow.open(map);
    });
    
    return marker;
}

function showSamplePath() {
    path = [];

    // first point  
    var latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);

    latitude += Math.random() / 100;
    longitude -= Math.random() / 100;

    // next point
    latlong = new google.maps.LatLng(latitude, longitude);
    path.push(latlong);


    var line = new google.maps.Polyline({
        path: path,
        strokeColor: '#0000ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    line.setMap(map);

    map.panTo(latlong);
    // over write the point information
    document.getElementById("Clatitude").innerHTML =
          "Current Latitude: " + latitude;
    document.getElementById("Clongitude").innerHTML =
            "Current Longitude: " + longitude;

    if (lastMarker)
        lastMarker.setMap(null);
    // add the new marker
    lastMarker = addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}






















