function initMap() {
  var map = new google.maps.Map(document.getElementById("map"),{
    zoom: 5,//zoom representa el nivel de profundidad de nuestro mapa, entre más zoom más localizado se verá.
    center: {lat: -9.1191427, lng: -77.0349046},//center contiene la longitud y latitud en que queremos que se muestre nuestro mapa
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  function search(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success, funcionError);//getCurrentPosition permite al usuario obtener su ubicación actual, uncionExito se ejecuta solo cuando el usuario comparte su ubicación, mientras que funcionError se ejecuta cuando se produce un error en la geolocalización
    }
  }

  document.getElementById("findMe").addEventListener("click", search);
  var latitud, longitud;

  var success = function(posicion){//var success, con el que obtendremos nuestra latitud o longitud y además crearemos un marcador de nuestra ubicación.
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var miUbicacion = new google.maps.Marker({
      position: {lat:latitud, lng:longitud},
      animation: google.maps.Animation.DROP,
      map: map
    });

    map.setZoom(17);
    map.setCenter({lat:latitud, lng:longitud});
  }

  var funcionError = function(error){//funcionError con un mensaje para el usuario, en caso de que nuestra geolocalización falle.
    alert("tenemos un problema con encontrar tu ubicación");
  }
     new AutocompleteDirectionsHandler(map);
      }
       /**
        * @constructor
       */
  function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
        var originInput = document.getElementById('inputOrigin');
        var destinationInput = document.getElementById('inputDestination');
        //var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);
        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});

       this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-transit', 'TRANSIT');
        this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById('id');
        var me = this;
        buttonRoute.addEventListener('click', function() {
          me.travelMode = mode;
          me.route();
        });
      };
      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;
        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

      };


    