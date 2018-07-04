/*Ryan Lanclos NFL team wins Leaflet example. 2018 UWisc Geog575*/
$(document).ready(function() {
    //set variables for the map
	var cities;
    var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoibGFuY2xvcyIsImEiOiJjaXh2emk3bHUwMDBqMzJsbTdqZ3JqNjh2In0.3oJJCcmFDeCpPRpdioLsOw'
        }),
    dark   = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoibGFuY2xvcyIsImEiOiJjaXh2emk3bHUwMDBqMzJsbTdqZ3JqNjh2In0.3oJJCcmFDeCpPRpdioLsOw'
        }),
    streets   = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGFuY2xvcyIsImEiOiJjaXh2emk3bHUwMDBqMzJsbTdqZ3JqNjh2In0.3oJJCcmFDeCpPRpdioLsOw'
        });
	//set baseMaps group variable to add to the layer control
    var baseMaps = {
        "Light": light,
        "Dark": dark,
        "Streets": streets
    };
    //set the map view!
    var map = L.map('map', {
        center: [37.0902, -95.7129,],
        zoom: 4,
        layers: [light]
    });
    //add layer control to the map 
    L.control.layers(baseMaps).addTo(map);
    
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
    
    //load the geojson data for football stadium attendance
    $.getJSON('data/wins.geojson')   
		.done(function(data) {
			var info = processData(data);
            //call functions for symbols and temporal slider
            createPropSymbols(info.timestamps, data);
            createSliderUI(info.timestamps);
    })
        
    // process the data with a loop into an array
    function processData(data) {
        var timestamps = [];
		var min = Infinity; 
		var max = -Infinity;
        for (var feature in data.features) {
            var properties = data.features[feature].properties; 
            for (var attribute in properties) {
                if ( attribute != 'Team') {
                    if ( $.inArray(attribute,timestamps) === -1) {
                        timestamps.push(attribute);
                    }
                    if (properties[attribute] < min) {
                        min = properties[attribute];
                    }
                    if (properties[attribute] > max) {
                        max = properties[attribute];
                    }
                }
            }
        }
        return {
            timestamps : timestamps,
            min : min,
            max : max
        }
    }
    
    //create the symbols for the data and set popups
    function createPropSymbols(timestamps, data) {
        cities = L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, { 
                    //set the marker colors to the NFL standard!
                    fillColor: '#D50A0A',
                    color: '#013369',
                    weight: 0.5,
                    fillOpacity: 0.5 
				}).on({
                    mouseover: function() {
                        this.openPopup();
                    },
                    mouseout: function() {
                        this.closePopup();
					}
				});
			}
		}).addTo(map);
        updatePropSymbols(timestamps[0]);
    }
    //update the marker and popup based on the year
    function updatePropSymbols(timestamp) {
        cities.eachLayer(function(layer) {
            var props = layer.feature.properties;
			var radius = calcPropRadius(props[timestamp]);
			var popupContent = 'In<b> ' + timestamp + '</b>, the ' + props.Team + ' had<b> ' + String(props[timestamp]) + 
					' wins.</b>';
			layer.setRadius(radius);
			layer.bindPopup(popupContent, { offset: new L.Point(0,-radius) });
		});
	}
    
    //scale the marker based on attendance for the year
	function calcPropRadius(attributeValue) {
        var scaleFactor = 20;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI)* 2;			
	}
    
    //creat temporal slider to navigate the years
    function createSliderUI(timestamps) {
        var sliderControl = L.control({ position: 'bottomleft'} );
        sliderControl.onAdd = function(map) {
            var slider = L.DomUtil.create('input', 'range-slider');
            //enable and disble map dragging to avoid pans when using the slider
			L.DomEvent.addListener(slider, 'mousedown', function(e) { 
				map.dragging.disable() 
			});
            L.DomEvent.addListener(slider, 'mouseup', function(e) { 
				map.dragging.enable() 
			});
			$(slider)
				.attr({'type':'range',
                       'max': timestamps[timestamps.length-1],
                       'min': timestamps[0],					
                       'step': 1,
                       'value': String(timestamps[0])})
                .on('input change', function() {
                updatePropSymbols($(this).val().toString());
                $('.temporal-legend').text(this.value);
            });
            return slider;
        }
		sliderControl.addTo(map)
        createTemporalLegend(timestamps[0]); 
	}
    //set the legend above the slider to show what year the data is using
    function createTemporalLegend(startTimestamp) {
        var temporalLegend = L.control({ position: 'bottomleft' });
        temporalLegend.onAdd = function(map) {
            var output = L.DomUtil.create('output', 'temporal-legend');
            $(output).text(startTimestamp)
            return output;
        }
        temporalLegend.addTo(map);
    }
});