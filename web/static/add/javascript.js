$(document).ready(()=>{
  $(".submitCreate").click(()=>{
    alert("submitted");
    var newEntry = new Object();
    newEntry.name = $("#name").val();
    newEntry.cutlery = $("#cutlery:checked").val()=="on"? "true" : false;
    newEntry.plate = $("#plate:checked").val()=="on"? "true" : false;
    newEntry.compost = $("#compost:checked").val()=="on"? "true" : false;
    newEntry.comments = $("#comments").val();
    newEntry.lat = parseFloat($("#lat").val());
    newEntry.long = parseFloat($("#long").val());
    newEntry.mapsid = $("#mapsid").val();
    url=
    console.log(jQuery.param(newEntry));
    $.ajax({
        url: '/api/places?'+jQuery.param(newEntry),
        type: 'POST',
        headers: {"accessToken": "accessToken"},
        success: function(result) {
            console.log(result);
        }
    });
  })
  $('.ui.checkbox')
    .checkbox()
  ;
});

$(document)
    .ready(function() {

    })
  ;

var map;

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('addmap'), {
  center: {lat: 49.267, lng: -123.1455},
    zoom: 13,
    mapTypeId: 'roadmap',
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

  // Create the search box and link it to the UI element.
  var input = document.getElementById('location');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Set form values
    $("#name").val(places[0].name);
    $("#mapsid").val(places[0].place_id);
    console.log(places[0]);
    $("#lat").val(places[0].geometry.location.lat());
    $("#long").val(places[0].geometry.location.lng());


    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    
    markers = [];
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

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
    });
    map.fitBounds(bounds);
  });
}
