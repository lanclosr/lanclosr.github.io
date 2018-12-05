//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
    //set variables for the map
    var light = L.esri.basemapLayer('Gray'),
        streets   = L.esri.basemapLayer('Streets'),
        topographic   = L.esri.basemapLayer('Topographic');
	//set baseMaps group variable to add to the layer control
    var baseMaps = {
        "Light Gray": light,
        "Street Map": streets,
        "Topographic": topographic
    };
    //set the map view!
    var map = L.map('map', {
        scrollWheelZoom: false,
        center: [29.8604, -95.3698,],
        zoom: 10,
        layers: [topographic]
    });
    
    //create pane to draw lables
    map.createPane('canvas');
    map.getPane('canvas').style.zIndex = 200;
    map.getPane('canvas').style.pointerEvents = 'none';
    
    //add layer control to the map 
    L.control.layers(baseMaps).addTo(map);
    
    //add Navbar to the map
    L.control.navbar().addTo(map);
    
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
    
    //set the style for floodplain
    var floodplainStyle = {
        "color": "DarkSlateBlue",
        "weight": 0.5,
        "opacity": 0.4
    };
    
    //load FEMA national layer
    var femaZones = L.esri.featureLayer({
        url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28',
        minZoom:15,
        style: floodplainStyle,
    }).addTo(map);
    
    //set popup on the FEMA layer when people click manually
    femaZones.bindPopup(function (layer) {
        return L.Util.template('<p>THIS AREA IS DESIGNATED AS {ZONE_SUBTY}.</p>', layer.feature.properties);
       });
    
    //add a legend to the bottom right
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        classes = ["FEMA 0.2% Flood Zone "],
        labels = ["img/flood.png"];

        return div;
    };

    legend.addTo(map);
    
    //set geolocation for the user
    $('.pure-button').on('click', function(){
        map.locate({setView: true, maxZoom: 15});
    });

    map.on('locationfound', onLocationFound);
    function onLocationFound(e) {
        console.log(e);
        L.marker(e.latlng).addTo(map)
    //}
    //try something new here...
    var identifiedFeature;
    var pane = document.getElementById('selectedFeatures');

    map.on('click', function (e) {
        pane.innerHTML = 'Loading';
        if (identifiedFeature){
            map.removeLayer(identifiedFeature);
        }
        femaZones.identify().on(map).at(e.latlng).run(function(error, featureCollection){
        // make sure at least one feature was identified.
            if (featureCollection.features.length > 0) {
                identifiedFeature = L.geoJSON(featureCollection.features[0]).addTo(map);
                var zoneDescription = featureCollection.features[0].properties['Test' + 'ZONE_SUBTY'];
                pane.innerHTML = zoneDescription;
            }
            else {
                pane.innerHTML = 'No features identified.';
            }
        })
    })
    }
});