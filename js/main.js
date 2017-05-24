var width = 960;
var height = 600;

var svg = d3.select("svg");

var path = d3.geoPath();

var dataExternal = null;

d3.csv("data/FHWA State Gas Tax Rates Topo 5-23-17.csv", function(error, data) {
    if (error) throw error;

    // Convert to numbers
    dataDict = {};
    data.forEach(function(d) {
        d["2000"] = +d["2000"];
        d["2001"] = +d["2001"];
        d["2002"] = +d["2002"];
        d["2003"] = +d["2003"];
        d["2004"] = +d["2004"];
        d["2005"] = +d["2005"];
        d["2006"] = +d["2006"];
        d["2007"] = +d["2007"];
        d["2008"] = +d["2008"];
        d["2009"] = +d["2009"];
        d["2010"] = +d["2010"];
        d["2011"] = +d["2011"];
        d["2012"] = +d["2012"];
        d["2013"] = +d["2013"];
        d["2014"] = +d["2014"];
        d["2015"] = +d["2015"];
        d["2016"] = +d["2016"];

        dataDict[d["TOPO_ID"]] = d
    });

    data = dataDict;
    dataExternal = data;
    console.log("dataExternal")
    console.log(dataExternal)

    d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
        if (error) throw error;
        console.log(topojson.feature(us, us.objects.states).features);

        svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                return fillState(data, d.id, 2000)
            });

        svg.append("path")
            .attr("class", "state-borders")
            .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

    });
});

// Define color scale

var colorDomain = [15, 20, 25, 30, 35];
var extendedColorDomain = [0, 15, 20, 25, 30, 35];
var colorRange = ["#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"];
var colorRange2 = ['#f6eff7','#d0d1e6','#a6bddb','#67a9cf','#1c9099','#016c59']
var colorRange3 = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c']

var legend_labels = ["<15", "15+", "20+", "25+", "30+", "35+"];


var color = d3.scaleThreshold()
    .domain(colorDomain)
    .range(colorRange3);

// Helper function for styling choropleth
var fillState = function(data, idNum, baseYear) {
    // Get tax rate number
    taxRate = data[idNum][baseYear.toString()];

    // Find color
    return color(taxRate);
};

//////////// Legend ////////////
var legend = svg.selectAll("g.legend")
    .data(extendedColorDomain)
    .enter().append("g")
    .attr("class", "legend");

var ls_w = 20, ls_h = 20;

legend.append("rect")
    .attr("x", width - 4 * ls_w)
    .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d, i) { return color(d); })
    .style("opacity", 0.8);

legend.append("text")
    .attr("x", width - 2.75 * ls_w)
    .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
    .text(function(d, i){ return legend_labels[i]; });




$( function() {
    $( "#slider" ).slider({
        value:2000,
        min: 2000,
        max: 2016,
        step: 1,
        slide: function( event, ui ) {
            updateStateColors(ui.value);
            updateYear(ui.value);
        },
    });
});

var updateStateColors = function(baseYear) {

    svg.selectAll("g path")
        .attr("fill", function(d) {
            return fillState(dataExternal, d.id, baseYear)
        })
};

var updateYear = function(baseYear) {
    titleText = "State Gas Taxes | " + baseYear.toString();
    console.log(titleText);
    d3.select("#title-name").html(titleText)
}

