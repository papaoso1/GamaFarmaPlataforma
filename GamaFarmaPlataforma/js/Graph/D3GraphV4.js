$.fn.biPartiteDouble = function (options) {
    var Args = {
        data: [],
        margin: { top: 0, right: 0, bottom: 0, left: 40 },
        color: { Elite: "#3366CC", Grand: "#DC3912", Lite: "#FF9900", Medium: "#109618", Plus: "#990099", Small: "#0099C6" },
        height: 500,
        titleL: "Titulo Izquierda",
        titleR: "Titulo Derecha"

    };
    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;

    $(settings.element).data(settings);


    var d3Container = d3.select(element),
        width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
        height = settings.height - settings.margin.top - settings.margin.bottom - 5;
    var container = d3Container.append("svg");


    var svg = container
        .attr("width", width + settings.margin.left + settings.margin.right)
        .attr("height", height + settings.margin.top + settings.margin.bottom)
        .append("g")
           .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");

    svg.append("text").attr("x", 250).attr("y", 70)
    .attr("class", "header").text(settings.titleL);

    svg.append("text").attr("x", 750).attr("y", 70)
        .attr("class", "header").text(settings.titleR);

    var g = [svg.append("g").attr("transform", "translate(150,100)")
		, svg.append("g").attr("transform", "translate(650,100)")];

    var bp = [viz.bP()
            .data(settings.data)
            .min(12)
            .pad(1)
            .height(600)
            .width(200)
            .barSize(35)
            .fill(d=>settings.color[d.primary])
        , viz.bP()
            .data(settings.data)
            .value(d=>d[3])
            .min(12)
            .pad(1)
            .height(600)
            .width(200)
            .barSize(35)
            .fill(d=>settings.color[d.primary])
    ];
    [0, 1].forEach(function (i) {
        g[i].call(bp[i])

        g[i].append("text").attr("x", -50).attr("y", -8).style("text-anchor", "middle").text("Channel");
        g[i].append("text").attr("x", 250).attr("y", -8).style("text-anchor", "middle").text("State");

        g[i].append("line").attr("x1", -100).attr("x2", 0);
        g[i].append("line").attr("x1", 200).attr("x2", 300);

        g[i].append("line").attr("y1", 610).attr("y2", 610).attr("x1", -100).attr("x2", 0);
        g[i].append("line").attr("y1", 610).attr("y2", 610).attr("x1", 200).attr("x2", 300);

        g[i].selectAll(".mainBars")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        g[i].selectAll(".mainBars").append("text").attr("class", "label")
            .attr("x", d=>(d.part == "primary" ? -30 : 30))
            .attr("y", d=>+6)
            .text(d=>d.key)
            .attr("text-anchor", d=>(d.part == "primary" ? "end" : "start"));

        g[i].selectAll(".mainBars").append("text").attr("class", "perc")
            .attr("x", d=>(d.part == "primary" ? -100 : 80))
            .attr("y", d=>+6)
            .text(function (d) { return d3.format("0.0%")(d.percent) })
            .attr("text-anchor", d=>(d.part == "primary" ? "end" : "start"));
    });
    function mouseover(d) {
        [0, 1].forEach(function (i) {
            bp[i].mouseover(d);

            g[i].selectAll(".mainBars").select(".perc")
            .text(function (d) { return d3.format("0.0%")(d.percent) });
        });
    }
    function mouseout(d) {
        [0, 1].forEach(function (i) {
            bp[i].mouseout(d);

            g[i].selectAll(".mainBars").select(".perc")
            .text(function (d) { return d3.format("0.0%")(d.percent) });
        });
        d3.select(self.frameElement).style("height", "800px");

    }
}

$.fn.biPartite = function (options)
{
    var Args = {
        data: [],
        margin: { top: 0, right: 0, bottom: 0, left: 40 },
        color: { Elite: "#3366CC", Grand: "#DC3912", Lite: "#FF9900", Medium: "#109618", Plus: "#990099", Small: "#0099C6" },
        height: 800,
        orient:"horizontal",
        titleL: "Titulo Izquierda",
        width:800
       

    };
    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;
    $(settings.element).data(settings);

    var d3Container = d3.select(element),
        width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
        height = settings.height - settings.margin.top - settings.margin.bottom - 5;
    var container = d3Container.append("svg");
    var svg = container
        .attr("width", width + settings.margin.left + settings.margin.right)
        .attr("height", height + settings.margin.top + settings.margin.bottom)
        .append("g")
           .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");

    var g = svg.append("g").attr("transform", "translate(200,50)");

    var bp = viz.bP()
		.data(settings.data)
		.min(12)
		.pad(1)
		.height(settings.height-100)
		.width(settings.width)
		.barSize(35)
        .orient(settings.orient)
		.fill(d=>settings.color[d.primary]);

    g.call(bp);

    g.selectAll(".mainBars")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)

    g.selectAll(".mainBars").append("text").attr("class", "label")
        .attr("x", d=>(d.part == "primary" ? -30 : 30))
        .attr("y", d=>+6)
        .text(d=>d.key)
        .attr("text-anchor", d=>(d.part == "primary" ? "end" : "start"));

    g.selectAll(".mainBars").append("text").attr("class", "perc")
        .attr("x", d=>(d.part == "primary" ? -100 : 80))
        .attr("y", d=>+6)
        .text(function (d) { return d3.format("0.0%")(d.percent) })
        .attr("text-anchor", d=>(d.part == "primary" ? "end" : "start"));

    function mouseover(d) {
        bp.mouseover(d);
        g.selectAll(".mainBars")
        .select(".perc")
        .text(function (d) { return d3.format("0.0%")(d.percent) })
    }
    function mouseout(d) {
        bp.mouseout(d);
        g.selectAll(".mainBars")
            .select(".perc")
        .text(function (d) { return d3.format("0.0%")(d.percent) })
    }
}

$.fn.chord = function (options)
{
    var Args = {
        data: [],
        margin: { top: 0, right: 0, bottom: 0, left: 40 },
        color: {},
        height: 600,
        sortOrder: [],
        valueFormat: function (x) { return x },
        color: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6"],
        source: 0,
        target: 1,
        padding: .05,
        title:'',
        sortOrder: [],
        chordOpacity:.2,
        innerRadius:170,
        outerRadius: 200,
        labelPadding:.1

    };
    function sort(a, b) { return d3.ascending(settings.sortOrder.indexOf(a), settings.sortOrder.indexOf(b)); }

    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;
    $(settings.element).data(settings);

    var d3Container = d3.select(element),
        width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
        height = settings.height - settings.margin.top - settings.margin.bottom - 5;
    var container = d3Container.append("svg");
    var svg = container
        .attr("width", width + settings.margin.left + settings.margin.right)
        .attr("height", height + settings.margin.top + settings.margin.bottom)
        .append("g")
           .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");


    var chi = viz.ch().data(settings.data).padding(.05)
      .source(d=>d[settings.source])
      .target(d=>d[settings.target])
      .sort(sort)
        .chordOpacity(settings.chordOpacity)
	  .valueFormat(settings.valueFormat)
      .fill(function (d) { return colors[d]; })
     .innerRadius(settings.innerRadius)
	 .outerRadius(settings.outerRadius)
    .labelPadding(settings.labelPadding);

    

    svg.append("g").attr("transform", "translate(300,300)").call(chi);
    svg.append("text").attr("x", 300).attr("y", 50).text(settings.title).style("font-weight", "bold")

}