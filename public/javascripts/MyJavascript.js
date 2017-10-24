var map, infoWindow;
var marker;
var circle;
var list_checking_marker = [];
var currentIndex = -1;
var countMedia = -1;

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 10.7626391, lng: 106.6820268},
        zoom: 13
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
            var tmp_marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });
            tmp_marker.addListener('click',function (event) {
                if(marker != null)
                    marker.setMap(null);
                clickOnMap(event);
            });
            markers.push(tmp_marker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });//end place.for each
        map.fitBounds(bounds);
    });
}
// instagram bar event
$('#button_search').on('click',function () {
    $.ajax({
        method:'GET',
        url:'http://localhost:3000/api/instagram/locations?lat=48.858844&lng=2.294351'
    }).done(function (data) {
        console.log(data);
    })

});

$('#geolocation').on('click',function () {
    // alert('click geolocation');
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
            addMarker(pos,'A','your location');
            getAllChecking(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

$('#table-body').on('click','tr',function () {
    // alert($(this).attr('id'));
    var lat = $(this).attr('data-lat');
    var lng = $(this).attr('data-lng');
    getMediaByLatLng(lat,lng);
    $('#list-media').text('loading.......');
});

$('#list-media').on('click','li',function () {
    // alert($(this).attr('id'));
    var id = $(this).attr('id');
    currentIndex = parseInt($(this).attr('data-index'));
    // getMediaByLatLng(lat,lng);
    // alert('click on image id : ' + id);
    showModal(id);
});
//------------------chuyen bai viet
function plusSlides(n) {
    //cong them index n
    currentIndex = (currentIndex + n + countMedia)%countMedia;
    // alert(currentIndex);
    var slideId = $(".media")[currentIndex].id;
    showModal(slideId);
}
//=================== mo rong va thu hep bang dieu khien==================
$('#extend').on('click',function () {

   if($('#extend').attr('data-type') === 'extend'){
       // mo rong
       extendInstagramBar();
       $('#extend').html('&larr;');
       $('#extend').attr('data-type','collapse');
   }else{
       collapseInstagramBar();
       //thu hep
       $('#extend').html('&rarr;');
       $('#extend').attr('data-type','extend');
   }
});
function extendInstagramBar() {
    $('#instagram').attr('class',"gradient col-sm-8");
    $('#map').attr('class',"col-sm-4");
    $('#left-side').attr('class',"row");
    $('#instagram-area').attr('class',"col-sm-4");
    $('#media-container').attr('class',"col-sm-8 extended-media-container");
    $('#place-checking-contain').attr('class','extended-place-checking-container');
}
function collapseInstagramBar() {
    $('#instagram').attr('class',"gradient col-sm-4");
    $('#map').attr('class',"col-sm-8");
    $('#left-side').attr('class',"");
    $('#instagram-area').attr('class',"");
    $('#media-container').attr('class',"collapsed-media-container");
    $('#place-checking-contain').attr('class','collapsed-place-checking-container');
}
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        closeModal();
    }
});

function closeModal() {
    $('.circle-img').attr('src','/images/loading-profile-image.jpg');
    $('#myMedia').html('<img class="img-large" src="/images/loading-image.jpg" alt="image">');
    $('.user-name').html('//user name');
    $('.caption-text').html('//caption');
    $('#myModal').hide();
    // showModal('1630917990667500943_1778902051');
    // alert("click on close");
}

function showModal(id) {
    $('#myModal').show();
    getMediaById(id);
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
    // marker.on('click',clickOnMarker());
    // addCricle(pos,400);
}

function addCheckingMarkers(pos, lable, title) {
    // console.log("aaaaa");
    var tmp_marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: pos,
        map: map,
        label: lable,
        title: title
    });

    tmp_marker.addListener('click',function () {
        // alert(this.label);
        if(this.label === 'I'){
            var lat = this.position.lat();
            var lng = this.position.lng();
            getMediaByLatLng(lat,lng);
            $('#list-media').text('loading.......');
        }

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
function clickOnMap(event) {
    // console.log(event.latLng);
    $('#table-body').text('loading........');
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
    countMedia = data.length;
    var html = '';
    var tmp;
    for(var i =0; i < data.length; i++){
        // console.log(data[i]);
        //issue
        tmp = '<li id="' + data[i].id + '" class="media" data-index="'+ i +'">';
        if(data[i].type === 'video') {
            tmp += '<video class="video-resolution" allowfullscreen="true" controls>';
            tmp += '<source src="' + data[i].videos.low_bandwidth.url + '" type="video/mp4"></video>';

        }else{
            tmp += '<img src="' + data[i].images.thumbnail.url +'" class="img-thumbnail" alt="Image">';
        }
        tmp += '</li>';
        html += tmp;
    }

    $('#list-media').html(html);
}
function showMediaModal(data){
    // user information;
    $('.circle-img').attr('src',data.user.profile_picture);
    $('.user-name').html(data.user.username);
    if(data.caption === null){
        $('.caption-text').html('<i> no caption </i>');
    }else{
        $('.caption-text').html(data.caption.text);
    }
    // console.log(data.type);
    if(data.type === 'video'){

        var html = '<video width="' + data.videos.standard_resolution.width +'" ' +
            'height="'+ data.videos.standard_resolution.height +'" allowfullscreen="true" controls autoplay>';
        // var html = '<video width="800" height="800" class="img-responsive" allowfullscreen="true" controls autoplay>';
        html += '<source src="' + data.videos.standard_resolution.url + '" type="video/mp4">';
        html += '</video>';
        console.log(html);

        $('#myMedia').html(html);

    }else{
        $('#myMedia').html('<img class="img-large" src="' + data.images.standard_resolution.url + '" alt="image">');
    }
}
//send and receive data
function getAllChecking(pos) {
    $.ajax({
        method:'GET',
        url:'https://instagram-and-google-map-api.herokuapp.com/api/instagram/locations?lat=' + pos.lat + '&lng=' + pos.lng
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
        url:'https://instagram-and-google-map-api.herokuapp.com/api/instagram/media?lat=' + lat + '&lng=' + lng
    }).done(function (resp) {
        // console.log(resp);
        if(resp.meta.code === 200) {
            showListMedia(resp.data);
        }
    })
}

function getMediaById(id) {
    $.ajax({
        method:'GET',
        url:'https://instagram-and-google-map-api.herokuapp.com/api/instagram/id?id=' + id
    }).done(function (resp) {
        // console.log(resp);
        if(resp.meta.code === 200) {
            showMediaModal(resp.data);
        }
    })
}