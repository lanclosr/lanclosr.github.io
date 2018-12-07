//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(location) {
       
       //capture lat and lng of the user location
       var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
       
       //create the map using the lat and long as center
       var map = L.map('map').setView(latlng, 11);
       
       //set the basemap
       var basemap = L.esri.basemapLayer('Streets').addTo(map);
       
       //add the vector hazard layer for viewing
       var hazardsVector = L.esri.tiledMapLayer({
           url: 'https://tiles.arcgis.com/tiles/0ZRg6WRC7mxSLyKX/arcgis/rest/services/Hazard_Layer_Symbolize_Level11/MapServer/',
           opacity: 0.4,
           maxzoom: 11,
       }).addTo(map);
       
       //set the style for hazard json - clear for query/popup only
       var hazardsStyle = {
           "color": "white",
           "weight": 0,
           "opacity": 0
       };
       
       //load the json of the hazard data for query
       $.getJSON("data/hazards.json",function(data){
           var hazardsJson = L.geoJson(data, {style: hazardsStyle,
                                               onEachFeature: function(feature, featureLayer) {
                                                   featureLayer.bindPopup("<b>This area is at risk for the following key hazards:</b></br>" + " Flooding: " + (feature.properties.Flood).toLocaleString('en') + "<br>Hurricane: " + (feature.properties.Hurricane).toLocaleString('en') + "<br>Wildfire: " + (feature.properties.Wildfire).toLocaleString('en') + "<br>Earthquake: " + (feature.properties.Earthquake).toLocaleString('en') );
                                               }
                                              }).addTo(map);
       });
       
       //bind a popup to the features
       //var showMe = hazards.bindPopup(function (layer) {
           //return L.Util.template('<p>This location is at risk for the following hazards:</br>Flood:{Flood}</br>Hurricane:{Hurricane}</p>', //layer.feature.properties);
       //});
       
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