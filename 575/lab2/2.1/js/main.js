//execute script when window is loaded
window.onload = function(){
    
    //SVG dimensions
    var w = 900,
        h = 500;
    
    //get the <body> element from the page
    var container = d3.select("body")
        .append("svg") //put a new SVG in the body
        .attr("width", w)
        .attr("height", h)
        .attr("class", "container")
        .style("background-color","rgba(0,0,0,0.2)");
    
    //innerRect block
    var innerRect = container.append("rect")
        .datum(400)
        .attr("width",function(d){
            return d * 2; //400 *2 = 800
        })
        .attr("height",function(d){
            return d; //400
        })
        .attr("class","innerRect")//set class name
        .attr("x", 50)//position from left
        .attr("y", 50)//position from top
        .style("fill", "#FFFFFF"); //fill color
    
    //data array
    var cityPop = [
        { 
            city: 'Conroe',
            population: 82286
        },
        {
            city: 'Kansas City',
            population: 481420
        },
        {
            city: 'Redlands',
            population: 71288
        },
        {
            city: 'Columbia',
            population: 120612
        }
    ];
    
    // x coordinate linear scale
    var x = d3.scaleLinear()//create the scale
        .range([90, 810])//output min and max
        .domain([0,4]);//input min and max
    
    //min value of dataArray
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });
    
    //max value of dataArray
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });
    
    //scale for the cirles center y coordinate
    var y = d3.scaleLinear()
        .range([440,50])
        .domain([0,600000]);
    
    //color scale generator
    var color = d3.scaleLinear()
        .range([
            "#9fbfdf",
            "#3973ac"
        ])
        .domain([
            minPop,
            maxPop 
        ]);
    
    //circles block
    var circles = container.selectAll(".circles")
        .data(cityPop)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.population);
        })
        .style("fill", function(d, i){
            return color(d.population);
        })
        .style("stroke", "#000");
    
    //y axis
    var yAxis = d3.axisLeft(y)
        .scale(y);
    
    //create axis g element and append to axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50,0)")
        .call(yAxis);
    
    //add title for chart
    var title = container.append("text")
        .attr("class","title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("Hometown City Populations");
    
    //create format generator
    var format = d3.format(",");

    //circle labels
    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchors", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population) + 0;
        });

    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });

    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr("dy", "15")//vertical offset
        .text(function(d){
            return "Pop. " + format(d.population);
        });
};