//hattip to leaflet tutorials!!
//leaflet map for main index.html page
$(document).ready(function() {
    ar map = L.map('map', {
    minZoom: 5
  }).setView([38.5, -96.8], 6);
  L.esri.basemapLayer('Gray').addTo(map);

  var soil = L.esri.dynamicMapLayer({
    url: 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28',
    opacity: 0.7
  }).addTo(map);

  var identifiedFeature;
  var pane = document.getElementById('selectedFeatures');

  map.on('click', function (e) {
    pane.innerHTML = 'Loading';
    if (identifiedFeature){
      map.removeLayer(identifiedFeature);
    }
    soil.identify().on(map).at(e.latlng).run(function(error, featureCollection){
      // make sure at least one feature was identified.
      if (featureCollection.features.length > 0) {
        identifiedFeature = L.geoJSON(featureCollection.features[0]).addTo(map);
        var soilDescription =
          featureCollection.features[0].properties['ZONE_SUBTY'];
        pane.innerHTML = soilDescription;
      }
      else {
        pane.innerHTML = 'No features identified.';
      }
    });
  });
}