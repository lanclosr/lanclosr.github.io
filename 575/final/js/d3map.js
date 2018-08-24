//hattip to UW 575 lab and Mike Bostock for map example in d3
//auto function
(function(){

    // global variables
    var attrArray = ["DamageStructures", "Households", "F2015_Pop"];
  
    var expressed = attrArray[0];
    
    //begin scritp when the window loads
    window.onload = setMap();
    
    // setup the map
    function setMap(){    
        //load the data into the DOM
        d3.csv("data/watershedMap.csv", function(csvData){
        d3.json("data/watershedstopo.json", function(jsonData){
        //convert the topojson to geojson
        geojson = convertJson(jsonData);
        //join the csv attributes to the geojson data
        jsonData = joinData(geojson, csvData);
        //create the color scale
        colorScale = makeColorScale(csvData);
        //create a map with the data loaded
        createMap();
        })
        })
    };
    //function to convert topojson to geojson
    function convertJson(jsonData){
        var geojson = topojson.feature(jsonData, jsonData.objects.watersheds4326);
        return geojson;
    };
        
    //function to join the csv attributes to the geojson
    function joinData(geojson, csvData){
        
        var jsonRegions = geojson.features;
        
        //loopy loop to roll through the data and join
        for (var i=0; i<csvData.length; i++){
            var csvWatershed = csvData[i];
            var csvKey = csvWatershed.Watershed;

            for (var a=0; a<jsonRegions.length; a++){
                var jsonWatershed = jsonRegions[a].properties;
                var jsonKey = jsonWatershed.Watershed;

                if (jsonKey == csvKey){
                    for (var key in attrArray){
                        var attr = attrArray[key];
                        var val = parseFloat(csvWatershed[attr]);
                        jsonRegions[a].properties[attr] = val;
                    }
                }
                }
            }
    };
    
    //funtion to create the map
    function createMap(){
        //the good ole tooltip
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
        //map width and height
        var mapWidth = window.innerWidth * 0.9,
            mapHeight = 600;
        
        //where to place the map and config
        var svg = d3.select( "graphic" )
            .append( "svg" )
            .attr( "width", mapWidth )
            .attr( "height", mapHeight );
        
        //variable used to add data to the map below
        var g = svg.append( "g" );
        
        //projection for the map and data
        var albersProjection = d3.geoAlbers()
            .rotate([95.4, 0])
            .center([0, 29.9])
            .scale(35000)
            .translate([mapWidth / 2, mapHeight / 2]);
        
        //draw the data on the map
        var geoPath = d3.geoPath()
            .projection( albersProjection );
        
        //lets do it - add it all together
        var watersheds = g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr("class", function(d){
                return "watersheds " + d.properties.Watershed;
            })
            .attr( "d", geoPath )
            .style("fill", function(d){
                return choropleth(d.properties, colorScale);
            })
            .on("mouseover", function(d){
                d3.select(this);
            })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html(d.properties.Watershed + ":<br>" + (d.properties.DamageStructures).toLocaleString('en') + " structures were damaged during Harvey.");
            })
            .on("mouseout", function(){
                d3.select(this)
                tooltip.style("display", "none");
            });
        
        //label the watersheds
        svg.selectAll("label")
            .data( geojson.features )
            .enter().append("text")
            .attr("class", function(d){
                return "label " + d.properties.Watershed;
            })
            .attr("transform", function(d) { return "translate(" + geoPath.centroid(d) + ")"; })
            //.attr("dy", ".35em")
            .text(function(d) { return d.properties.Watershed; });
        };
    
    //function to create the color scale
    function makeColorScale(csvData){
        var colorClasses = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
        
        //color scale generator created
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);
                
        //array of all the values of the expressed attribute
        var domainArray = [];
        for (var i=0; i<csvData.length; i++){
            var val = parseFloat(csvData[i][expressed]);
            domainArray.push(val);
        };
       
        //assign array of expressed values as scale domain
        colorScale.domain(domainArray);
        
        return colorScale;        
    };
    
   //function to validate all attributes in the colorscale!
    function choropleth(props, colorScale){
        
        //make sure attribute is a number
        var val = parseFloat(props[expressed]);
        
        //if it exists, assign a color, otherwise gray it out
        if (typeof val == 'number' && !isNaN(val)){
            return colorScale(val);
        } else {
            return "#ccc";
        };
    };
    
})();