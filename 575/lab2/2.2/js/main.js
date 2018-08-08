// setup the map
window.onload = function(){
    var width = 900,
        height = 600;

    var svg = d3.select( "body" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height )
        .attr("class", "svg");

    var g = svg.append( "g" );

    var albersProjection = d3.geoAlbers()
        .rotate([95.4, 0])
        .center([0, 29.9])
        .scale(35000)
        .translate([width / 2, height / 2]);

    var geoPath = d3.geoPath()
        .projection( albersProjection );

    d3.csv("data/watershedAttributes.csv", function(attributeData){
        console.log(attributeData);
    })

    d3.json("data/watershedstopo.json", function(watershedData){

    var geojson = topojson.feature(watershedData, watershedData.objects.watersheds4326)
    console.log(geojson);

    var watersheds = g.selectAll( "path" )
        .data( geojson.features )
        .enter()
        .append( "path" )
        .attr("class", "watersheds")
        .attr( "d", geoPath );
    })  
};