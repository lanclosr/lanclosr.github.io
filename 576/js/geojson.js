//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       
       //capture lat and lng of the user location
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       
       //create the map using the lat and long as center
       var map = L.map('map').setView(latlng, 13);
       
       //set the basemap
       var basemap = L.esri.basemapLayer('Streets').addTo(map);
       
       //add the hazard layer
       var hazards = L.esri.featureLayer({
           url: 'https://services.arcgis.com/0ZRg6WRC7mxSLyKX/arcgis/rest/services/Hazard_Layer_Symbolized/FeatureServer/0',
           maxzoom: 13,
       }).addTo(map);
       
       //bind a popup to the features
       var showMe = hazards.bindPopup(function (layer) {
           return L.Util.template('<p>THIS AREA IS DESIGNATED AS {ZONE_SUBTY}.</p>', layer.feature.properties);
       });
       
       //drop a marker at the user location from lat and long
       var marker = L.marker(latlng).addTo(map);
    
       //add Esri geocoder
        var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

        var searchControl = L.esri.Geocoding.geosearch({
            providers: [
                arcgisOnline,
                L.esri.Geocoding.mapServiceProvider({
                    label: 'States and Counties',
                    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
                })
            ]
        }).addTo(map);
   });
});