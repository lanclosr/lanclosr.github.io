//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       var map = L.map('map').setView(latlng, 13);
       var basemap = L.esri.basemapLayer('Streets').addTo(map);
       var femaZones = L.esri.featureLayer({
           url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28'
       }).addTo(map); 
       var marker = L.marker(latlng).addTo(map);
   });
});