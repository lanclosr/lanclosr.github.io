//load this when the window loads
//hattip to Mike Bostock for stacked bar example!
window.onload = function(){
    //set variables for chart container
    var svgContainer = d3.select("#chart").append("svg")
        .attr("width", 600)
        .attr("height", 400);
    //set variables for chart
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = svgContainer.attr("width") - margin.left - margin.right,
        height = svgContainer.attr("height") - margin.top - margin.bottom,
        g = svgContainer.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //set scales
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    //set colors for bar stacks
    var z = d3.scaleOrdinal()
        .range(["#026CB6", "#C21816"]);
    
    //add a tooltip
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
    //load data from csv
    d3.csv("data/watershedAttributes.csv", function(d, i, columns) {
      for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
      d.total = t;
      return d;
    }, function(error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);
    
    //sort the values to order the bars
      data.sort(function(a, b) { return b.total - a.total; });
      x.domain(data.map(function(d) { return d.Watershed; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
      z.domain(keys);
    
    //add the bars
      g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.Watershed); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function(d){
                d3.select(this);
            })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html(d.data.Watershed + ":<br>" + (d.data.Outside).toLocaleString('en') + " damaged structures outside the flood zone<br>" + (d.data.Inside).toLocaleString('en') + " damaged structures inside the flood zone");
            })
            .on("mouseout", function(){
                d3.select(this)
                tooltip.style("display", "none");
            });
    //add axis
      g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text").remove();

      g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("text-anchor", "start")
            .text("Structures");

      var legend = g.append("g")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    //add legend
      legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

      legend.append("text")
            .attr("class", "legend-text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .text(function(d) { return d; });

    //add the title to the chart
        g.append("text")
            .attr("y", 40)
            .attr("x", 70)
            .attr("class", "chartTitle")
            .text("Number of Damaged Structures by Watershed");
        
        g.append("text")
            .attr("y", 50)
            .attr("x", 70)
            .attr("class", "chartTitleSmall")
            .text("Data: FEMA");
    });
};