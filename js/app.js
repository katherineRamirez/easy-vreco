function initMap() {
  var map = new google.maps.Map(document.getElementById("map"),{
    zoom: 6,//zoom representa el nivel de profundidad de nuestro mapa, entre más zoom más localizado se verá.
    center: {lat: -29.1191427, lng: -73.0349046},//center contiene la longitud y latitud en que queremos que se muestre nuestro mapa
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false
  });
 
/* Mi localización */
  function search(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success, funcionError);//getCurrentPosition permite al usuario obtener su ubicación actual, uncionExito se ejecuta solo cuando el usuario comparte su ubicación, mientras que funcionError se ejecuta cuando se produce un error en la geolocalización
    }
  }

  /* Evento click con el botón Encuéntrame */
  document.getElementById("findMe").addEventListener("click", search);
  var latitud, longitud;

  var success = function(posicion){//var success, con el que obtendremos nuestra latitud o longitud y además crearemos un marcador de nuestra ubicación.
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

  var image = 'http://maps.gstatic.com/mapfiles/ms2/micons/cycling.png';
  var miUbicacion = new google.maps.Marker({
    position: {lat:latitud, lng:longitud},
    animation: google.maps.Animation.DROP,
    icon: image,
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
  
  /* Función autocompletado */
  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
  var originInput = document.getElementById('inputOrigin'); // Llamamos el id del input origen
  var destinationInput = document.getElementById('inputDestination'); // Llamamos el id del input destino
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput, {placeIdOnly: true});

    this.setupClickListener('changemode-transit', 'TRANSIT');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    
  }

  /* Establece un oyente con un botón de opción para cambiar el tipo de filtro en Lugares */
  AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    var radioButton = document.getElementById('id');
    var me = this;
    buttonRoute.addEventListener('click', function() { // Haciendo click en el botón ruta nos muestra alternativas de viaje
      me.travelMode = mode;
      me.route();
    });
  };


  AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map); // Autocompleta con los límites del mapa
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace(); // Obteniendo lugar a buscar
      if (!place.place_id) {
        window.alert("Seleccione una opción de la lista desplegable.");
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

  /* Controlador de instrucciones de autocompletar */
  /* Obteniendo ruta */
  AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) { // Si no encuentra lugar de origen o destino, retorna
      return;
    }
    var me = this;
    this.directionsService.route({
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode

    }, function(response, status) { // Función de respuesta y estado
      if (status === 'OK') {
        me.directionsDisplay.setDirections(response);
      } else {
        window.alert('Petición de indicaciones fallidas debido a ' + status);
      }
    });

  };

    