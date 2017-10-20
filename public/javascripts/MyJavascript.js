var map, infoWindow;
var marker;
var circle;
var place_list = ['111111','222222','3333333'];

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 10.7626391, lng: 106.6820268},
        zoom: 16
    });
    infoWindow = new google.maps.InfoWindow;

    // Create the search box and link it to the UI element.
    var input = document.getElementById('place_input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    // map.addListener('click', function() {
    //     searchBox.setBounds(map.getBounds());
    // });
    map.addListener('click', function(event) {
        addMarker(event.latLng);
        clickOnMap(event);
    });
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        if(places.length === 1){
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                addMarker(place.geometry.location);

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });//end place.for each

        }//end if
        else{
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });//end place.for each
        }//end else
        map.fitBounds(bounds);
    });
}

$('#button_search').on('click',function () {
    var context ={place: ['66666666666','66666666113','2131233']};
    //
    // $.getJSON( "localhost:3000/?lat=10&lng=20", function( data ) {
    //     alert("aaaaaaaaa");
    // });
    $.ajax({
        method:'GET',
        url:'http://localhost:3000/api/instagram/locations?lat=48.858844&lng=2.294351'
    }).done(function (data) {
        console.log(data);
    })
    // // $('tbody').html(result);
    // Object.observe(context, function() {
    //     var result = template(context);
    //     console.log(result);
    // });
    // console.log(result);
});

$('#geolocation').on('click',function () {
    alert('click geolocation');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            map.setCenter(pos);
            addMarker(pos,'a');
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
});

function addMarker(pos, lable) {
    if(marker!= null)
        marker.setMap(null);
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        label: lable
    });
    addCricle(pos,200);
}

function addCricle(pos, radius) {
    if(circle!= null)
        circle.setMap(null);
    circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        map: map,
        fillOpacity: 0.35,
        center: pos,
        radius: radius
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function clickOnMap(event) {
    console.log('click on map: ' + event);

}

