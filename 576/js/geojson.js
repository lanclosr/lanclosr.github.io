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
        "color": "black",
        "weight": 0.75,
        "opacity": 0.4
    };
    
    //set the style for watersheds
    var watershedStyle = {
        "color": "white",
        "weight": 0,
        "opacity": 0
    };
    
        
    //load the watershed data
    $.getJSON("/data/HarrisCountyWatersheds.json",function(data){
        var HCwatersheds = L.geoJson(data, {style: watershedStyle,
            onEachFeature: function(feature, featureLayer) {
            featureLayer.bindPopup("<b>" + feature.properties.Watershed + " Watershed:</b><br>" + (feature.properties.F2015_Pop).toLocaleString('en') + " people live in " + (feature.properties.Households).toLocaleString('en') + " households.<br>" + (feature.properties.Point_Count).toLocaleString('en') + " of those households sustained damage during Hurricane Harvey.");
            }
        }).addTo(map);
        });
    
    //load the floodplain data
    $.getJSON("/data/HarrisCountyFloodplain.json",function(data){
        L.geoJson(data, {style: floodplainStyle, pane: 'canvas'}).addTo(map);
    });
    
    //add a legend to the bottom right
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        classes = ["Harvey Damage Density", "FEMA 0.2% Flood Zone "],
        labels = ["../img/density.png","../img/flood.png"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < classes.length; i++) {
        div.innerHTML +=
            ("<img src="+ labels[i] +" height='20' width='20'>  ") + classes[i] +'<br>';
    }

    return div;
    };

    legend.addTo(map);
    
});