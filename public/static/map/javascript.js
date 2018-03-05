var map;
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var mapstart = {};

var markers = [];
mapstart.lat=49.267;
mapstart.long=-123.1455;
var lastwindow;
var service;
var markerCluster;

var userposition = {};
userposition.set = false;
function initAutocomplete() {
  window.onload =()=>{
    $('.ui.checkbox').checkbox({
      onChange: ()=>{
        UpdateMarkers(true);
      }
    });
    $('.hide').click(()=>{
      $('.ui.sidebar').hide();
      $('.show.menu').show();
    });
    $('.show.menu').click(()=>{
    $('.show.menu').hide();
      $('.ui.sidebar').show();
    });

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: mapstart.lat, lng: mapstart.long},
      zoom: 13,
      mapTypeId: 'roadmap',
      styles: mapStyle,
      zoomControlOptions: {
                      style: google.maps.ZoomControlStyle.SMALL,
                      position: google.maps.ControlPosition.RIGHT_BOTTOM
                  },
                  linksControl: false,
                  panControl: false,
                  addressControl: false,
                  enableCloseButton: false,
                  fullscreenControl: false,
                  enableCloseButton: false,
                  streetViewControl: false
    });
    service = new google.maps.places.PlacesService(map);
    // Create the search box and link it to the UI element.
    var input = document.getElementById('location');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
    // close info bubble when map clicked
    google.maps.event.addListener(map, "click", function(event) {
      if(lastwindow)
        lastwindow.close();
      });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      map.setCenter(searchBox.getPlaces()[0].geometry.location);
      UpdateMarkers();
    });
    $('#cutlery').click(()=>{UpdateMarkers(true)});
    $('#compost').click(()=>{UpdateMarkers(true)});
    $('#plate').click(()=>{UpdateMarkers(true)});

    UpdateMarkers();
  }
}

function UpdateMarkers(hasParams){

  // Clear out the old markers.
  if(markerCluster)
    markerCluster.clearMarkers();

  markers = [];
  openwindows = [];
  urlBase = "api/places"
  if(hasParams){
    urlBase += "?cutlery=";
    urlBase += $("#cutlery:checked").val()=="on"? "true" : "false";
    urlBase += "&plate=";
    urlBase += $("#plate:checked").val()=="on"? "true" : "false";
    urlBase += "&compost=";
    urlBase += $("#compost:checked").val()=="on"? "true" : "false";
  }
  markers = [];
  $.ajax({
      url: urlBase,
      type: 'GET',
      headers: {"accessToken": "accessToken"},
      success: function(res) {
      r = JSON.parse(res);
      r.forEach((place)=>{
        console.log(place);
        var infowindow = new google.maps.InfoWindow({
          content: infoBuilder(place)
        });

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(place.lat, place.lon),
          icon: 'static/shared/map-marker.svg',
          title: place.name
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        markers.push(marker);
    });
    $(".resCount").html(`${markers.length} results`);
    markerCluster = new MarkerClusterer(map, markers, {imagePath: 'static/shared/images/m'});
  }});
}

function infoBuilder(place){
  var check = `<img height="15px" src="/static/shared/check.png">`;
  var ex = `<img height="15px" src="/static/shared/ex.png">`;
  return`
    <h1> ${place.name} </h1>
    <h3> Sustainable options: </h3>
    <ul style="list-style: none;">
      <li>
        ${place.cutlery == "true" ? check : ex}
        Bring your own cutlery
      </li>
      <li>
        ${place.plate == "true" ? check : ex}
        Bring your own plate
      </li>
      <li>
        ${place.compost == "true" ? check : ex}
        Composting
      </li>
    </ul>
    <h3> Other Comments </h3>
    <p> ${place.comments} </p>
  `
}
