//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       //capture lat and lng of the user location
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       //create the map using the lat and long as center
       var map = L.map('map').setView(latlng, 16);
       //set the basemap
       var basemap = L.esri.basemapLayer('Streets').addTo(map);
       //set style of for the flood data
       var floodplainStyle = {
           "color": "DarkSlateBlue",
           "weight": 0.5,
           "opacity": 0.4
       };
       //load FEMA national layer and use the style above
       var femaZones = L.esri.featureLayer({
           url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28',
           maxzoom: 15,
           style: floodplainStyle,
       }).addTo(map); 
       //drop a marker at the user location from lat and long
       var marker = L.marker(latlng).bindPopup(function (layer) {
           return L.Util.template('<p>THIS AREA IS DESIGNATED AS {ZONE_SUBTY}.</p>', layer.feature.properties);
       }).addTo(map);
       
   });
});