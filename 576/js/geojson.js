//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       //capture lat and lng of the user location
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       //create the map using the lat and long as center
       var map = L.map('map').setView(latlng, 14);
       //set the basemap
       var basemap = L.esri.basemapLayer('Streets').addTo(map);
       //load FEMA national layer
       var femaZones = L.esri.featureLayer({
           url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28',
           maxzoom: 14,
           style: watersheds,
       }).addTo(map); 
       //drop a marker at the user location from lat and long
       var marker = L.marker(latlng).addTo(map);
   });
});