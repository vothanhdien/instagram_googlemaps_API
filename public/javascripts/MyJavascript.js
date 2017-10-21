var map, infoWindow;
var marker;
var circle;
var list_checking_marker = [];

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
// user bar event
$('#button_search').on('click',function () {
    $.ajax({
        method:'GET',
        url:'http://localhost:3000/api/instagram/locations?lat=48.858844&lng=2.294351'
    }).done(function (data) {
        console.log(data);
    })

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

$('#table-body').on('click','tr',function () {
    // alert($(this).attr('id'));
    var lat = $(this).attr('data-lat');
    var lng = $(this).attr('data-lng');
    getMediaByLatLng(lat,lng);
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//function in map
function addMarker(pos, lable, title) {
    if(marker != null)
        marker.setMap(null);
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        label: lable,
        title: title
    });
    addCricle(pos,400);
}

function addCheckingMarkers(pos, lable, title) {
    // console.log("aaaaa");
    var tmp_marker = new google.maps.Marker({
        position: pos,
        map: map,
        label: lable,
        title: title
    });
    list_checking_marker.push(tmp_marker);
}

function addCricle(pos, radius) {
    if(circle!= null)
        circle.setMap(null);
    circle = new google.maps.Circle({
        strokeColor: '#ff0f00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        map: map,
        fillOpacity: 0.35,
        center: pos,
        radius: radius
    });
}
function clickOnMarker(event) {
    //xet neu la A -> bo qua
    //neu la I ->> show infor
    // console.log(event);
    var lable;
    var id;
    if(lable){
        $('tr').forEach(function () {
            //get id
            getMediaById(id);
        })
    }
}
function clickOnMap(event) {
    // console.log(event.latLng);
    var pos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
    };
    getAllChecking(pos);
    // updateListChecking(respond);
    // showListCheckingOnMap(respond);

}
//show data
function updateListChecking(data) {
    var html = "";
    for(var i =0; i < data.length; i++){
        // console.log(data[i]);
        var tmp = '<tr id="' + data[i].id +'" data-lat="' + data[i].latitude + '" data-lng="' + data[i].longitude + '"' +
            '><td>';
        tmp += '<a href="#">' + data[i].name + '</a>';
        tmp += '</td></tr>';

        html += tmp;
    }
    // console.log(html);
    $('#table-body').html(html);
}

function showListCheckingOnMap(data) {
    clearnListCheckingMarkers();
    // console.log(data);
    for(var i =0; i < data.length; i++){
        var pos = new google.maps.LatLng(data[i].latitude,data[i].longitude);
        addCheckingMarkers(pos,'I',data[i].name);
        //add them thong tin id????
    }
}
function clearnListCheckingMarkers()
{
    for(var i = 0; i< list_checking_marker.length; i++){
        list_checking_marker[i].setMap(null);
    }
    list_checking_marker = [];
}
function showListMedia(data){
    var html = '';
    for(var i =0; i < data.length; i++){
        // console.log(data[i]);
        // if(data[i].type === 'image') {
            var tmp = '<li id="' + data[i].id + '" class="media">';

            tmp += '<img src="' + data[i].images.thumbnail.url +'" class="img-responsive" alt="Image">';
            tmp += '</li>';

            html += tmp;
            console.log(tmp);
        // }

    }

    $('#list-media').html(html);
}

//send and receive data
function getAllChecking(pos) {
    $.ajax({
        method:'GET',
        url:'http://localhost:3000/api/instagram/locations?lat=' + pos.lat + '&lng=' + pos.lng
    }).done(function (resp) {
        // console.log(resp);
        if(resp.meta.code === 200){
            updateListChecking(resp.data);
            showListCheckingOnMap(resp.data);
        }

    })
}
function getMediaByLatLng(lat,lng) {
    $.ajax({
        method:'GET',
        url:'http://localhost:3000/api/instagram/media?lat=' + lat + '&lng=' + lng
    }).done(function (resp) {
        console.log(resp);
        if(resp.meta.code === 200) {
            showListMedia(resp.data);
        }
    })
}