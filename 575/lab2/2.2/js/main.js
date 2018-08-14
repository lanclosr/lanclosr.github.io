// setup the map
window.onload = function(){
    
    //set the window size variables for the element
    var width = 900,
        height = 600;
    //svg setup
    var svg = d3.select( "body" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height )
        .attr("class", "svg");
    //variable to support calls later
    var g = svg.append( "g" );
    //projection for the map
    var albersProjection = d3.geoAlbers()
        .rotate([95.4, 0])
        .center([0, 29.9])
        .scale(35000)
        .translate([width / 2, height / 2]);
    //set the path for the map
    var geoPath = d3.geoPath()
        .projection( albersProjection );
    //load the data
    d3.csv("data/watershedAttributes.csv", function(attributeData){
        console.log(attributeData);
    })

    d3.json("data/watershedstopo.json", function(watershedData){
    //covert topojson to geojson
    var geojson = topojson.feature(watershedData, watershedData.objects.watersheds4326)
    console.log(geojson);
    //draw the map 
    var watersheds = g.selectAll( "path" )
        .data( geojson.features )
        .enter()
        .append( "path" )
        .attr("class", "watersheds")
        .attr( "d", geoPath );
    })  
};