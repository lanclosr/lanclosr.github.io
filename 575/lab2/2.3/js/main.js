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
        d3.csv("data/watershedAttributes.csv", function(csvData){
        d3.json("data/watershedstopo.json", function(jsonData){
        //convert the topojson to geojson
        geojson = convertJson(jsonData);
        //join the csv attributes to the geojson data
        jsonData = joinData(geojson, csvData);
        //create the color scale
        colorScale = makeColorScale(csvData);
        //create a map with the data loaded
        createMap();
        //add a chart and coordinate with the map
        setChart(csvData, colorScale);
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
        
        //map width and height
        var mapWidth = window.innerWidth * 0.5,
            mapHeight = 600;
        
        //where to place the map and config
        var svg = d3.select( "body" )
            .append( "svg" )
            .attr( "width", mapWidth )
            .attr( "height", mapHeight )
            .attr("class", "svg");
        
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
            
            //.attr("class", "watersheds")
            .attr("class", function(d){
                return "watersheds " + d.properties.Watershed;
            })
            .attr( "d", geoPath )
            .style("fill", function(d){
                return choropleth(d.properties, colorScale);
            });
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
    
    //function to create the bar chart
    function setChart(csvData, colorScale){
        
        //chart frame dimensions
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 600,
            leftPadding = 50,
            rightPadding = 2,
            topBottomPadding = 5,
            chartInnerWidth = chartWidth - leftPadding - rightPadding,
            chartInnerHeight = chartHeight - topBottomPadding,
            translate = "translate(" + leftPadding + "," + topBottomPadding + " )";
        
        //create a second svg element to hold the bar chart
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
        
        //create a rectangle for chart background fill
        var chartBackground = chart.append("rect")
            .attr("class", "chartBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
        //create a scale to size bars proportionally to frame
        var yScale = d3.scaleLinear()
            .range([600, 0])
            .domain([0, 16000]);

        //set bars for each watershed
        var bars = chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return a[expressed]-b[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.Watershed;
            })
            .attr("width", chartInnerWidth / csvData.length - 1)
            .attr("x", function(d, i){
                return i * (chartInnerWidth / csvData.length) + leftPadding;
            })
            .attr("height", function(d, i){
                return 600 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .style("fill", function(d){
                return choropleth(d, colorScale);
            })
        
        //chart title
        var chartTitle = chart.append("text")
            .attr("y", 40)
            .attr("x", 100)
            .attr("class", "chartTitle")
            .text("Amount of Damage per Watershed");
        
        //create vertical axis generator
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //place axis
        var axis = chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(yAxis);

        //create frame for chart border
        var chartFrame = chart.append("rect")
            .attr("class", "chartFrame")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
    };
})();