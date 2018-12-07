//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       var mymap = L.map('mapid').setView(latlng, 13)
       
       L.esri.basemapLayer('Streets').addTo(map);
       
       var marker = L.marker(latlng).addTo(mymap);
   });
});