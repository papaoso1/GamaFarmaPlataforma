$.fn.paintStreaGraph = function(options)
{
    var Args = {
        data:[],
        colorrange: ['#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE'],
        margin: { top: 5, right: 50, bottom: 40, left: 50 },
        //  width:400,
        height: 400,
        xAxisFormat: function () { return (d3.time.format("%m/%d/%y")) },
        yAxisFormat: function (d) { return (d ) + "k"; },
        tooltipOffset: 30,
        toolTipFun: function (d)
        {
            return "<ul class='list-unstyled mb-5'>" +
                            "<li><div class='text-size-base mt-5 mb-5'><i class='icon-circle-left2 position-left'></i>" + d.key + "</div></li>" +
                            "<li>Visits: &nbsp;<span class='text-semibold pull-right'>pro</span></li>" +
                            "<li>Time: &nbsp; <span class='text-semibold pull-right'>" + formatDate(d.values[mousedate].date) + "</span></li>" +
                        "</ul>";
        }

    };
     
    var settings = $.extend( {}, Args, options );
    var element = '#' + this[0].id;

    $(element).data(settings);
    var d3Container = d3.select('#'+ this[0].id),
              margin = settings.margin,
              width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
              height = settings.height - margin.top - margin.bottom,
              tooltipOffset = 30;
    colorrange = settings.colorrange;
    // Tooltip
        var tooltip = d3Container
            .append("div")
            .attr("class", "d3-tip e")
            .style("display", "none")

    // Format date
        var format = d3.time.format("%m/%d/%y");
        var formatDate = d3.time.format("%H:%M");

    // Colors
        
    // Construct scales
    // ------------------------------
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var z = d3.scale.ordinal().range(colorrange);



    // Create axes
    // Horizontal
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.days, 1)
           // .innerTickSize(4)
            .tickPadding(8)
            .tickFormat(d3.time.format("%m/%d/%y")); // Display hours and minutes in 24h format
    // Left vertical
        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(6)
           // .innerTickSize(4)
           // .outerTickSize(0)
            .tickPadding(8)
            .tickFormat(settings. yAxisFormat);
    // Right vertical
        var yAxis2 = yAxis;
    // Dash lines
        var gridAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(6)
            .tickPadding(8)
            .tickFormat("")
            .tickSize(-width, 0, 0);
    // Create chart
    // ------------------------------

    // Container
        var container = d3Container.append("svg")
    // SVG element
        var svg = container
            .attr('width', width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Construct chart layout
    // ------------------------------
    // Stack
        var stack = d3.layout.stack()
            .offset("silhouette")
            .values(function (d) { return d.values; })
            .x(function (d) { return d.date; })
            .y(function (d) { return d.value; });
    // Nest
        var nest = d3.nest()
            .key(function (d) { return d.key; });
    // Area
        var area = d3.svg.area()
            .interpolate("cardinal")
            .x(function (d) { return x(d.date); })
            .y0(function (d) { return y(d.y0); })
            .y1(function (d) { return y(d.y0 + d.y); });
  
        settings.data.forEach(function (d) {
            d.date = format.parse(d.date);
            d.value = +d.value;
        });

    // Stack and nest layers
        var layers = stack(nest.entries(settings. data));
    // Horizontal
        x.domain(d3.extent(settings.data, function (d, i) { return d.date; }));
    // Vertical
        y.domain([0, d3.max(settings.data, function (d) { return d.y0 + d.y; })]);
    // Horizontal grid. Must be before the group
        svg.append("g")
            .attr("class", "d3-grid-dashed")
            .call(gridAxis);
    // Append chart elements------------------------------------------------------------------
       // Stream layers
     // Create group
        var group = svg.append('g')
            .attr('class', 'streamgraph-layers-group');
    // And append paths to this group
        var layer = group.selectAll(".streamgraph-layer")
            .data(layers)
            .enter()
                .append("path")
                .attr("class", "streamgraph-layer")
                .attr("d", function (d) { return area(d.values); })
                .style('stroke', '#fff')
                .style('stroke-width', 0.5)
                .style("fill", function (d, i) { return z(i); });

    // Add transition
        var layerTransition = layer
            .style('opacity', 0)
            .transition()
                .duration(750)
                .delay(function (d, i) { return i * 50; })
                .style('opacity', 1)
    // Append axes
    // ------------------------------

    //
    // Left vertical
    //
      svg.append("g")
            .attr("class", "d3-axis d3-axis-left d3-axis-solid")
            .call(yAxis.orient("left"));
    // Hide first tick
        d3.select(svg.selectAll('.d3-axis-left .tick text')[0][0])
            .style("visibility", "hidden");
    //
    // Right vertical
    //
        svg.append("g")
            .attr("class", "d3-axis d3-axis-right d3-axis-solid")
            .attr("transform", "translate(" + width + ", 0)")
            .call(yAxis2.orient("right"));

    // Hide first tick
        d3.select(svg.selectAll('.d3-axis-right .tick text')[0][0])
            .style("visibility", "hidden");


    //
    // Horizontal
    //

        var xaxisg = svg.append("g")
            .attr("class", "d3-axis d3-axis-horizontal d3-axis-solid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    // Add extra subticks for hidden hours
        xaxisg.selectAll(".d3-axis-subticks")
            .data(x.ticks(d3.time.hours), function (d) { return d; })
            .enter()
            .append("line")
            .attr("class", "d3-axis-subticks")
            .attr("y1", 0)
            .attr("y2", 4)
            .attr("x1", x)
            .attr("x2", x);



    // Add hover line and pointer
    // ------------------------------

    // Append group to the group of paths to prevent appearance outside chart area
        var hoverLineGroup = group.append("g")
            .attr("class", "hover-line");

    // Add line
        var hoverLine = hoverLineGroup
            .append("line")
            .attr("y1", 0)
            .attr("y2", height)
            .style('fill', 'none')
            .style('stroke', '#fff')
            .style('stroke-width', 1)
            .style('pointer-events', 'none')
            .style('shape-rendering', 'crispEdges')
            .style("opacity", 0);

    // Add pointer
        var hoverPointer = hoverLineGroup
            .append("rect")
            .attr("x", 2)
            .attr("y", 2)
            .attr("width", 6)
            .attr("height", 6)
            .style('fill', '#03A9F4')
            .style('stroke', '#fff')
            .style('stroke-width', 1)
            .style('shape-rendering', 'crispEdges')
            .style('pointer-events', 'none')
            .style("opacity", 0);

    // Append events to the layers group
    // ------------------------------

        layerTransition.each("end", function () {
            layer
                .on("mouseover", function (d, i) {
                    svg.selectAll(".streamgraph-layer")
                        .transition()
                        .duration(250)
                        .style("opacity", function (d, j) {
                            return j != i ? 0.75 : 1; // Mute all except hovered
                        });
                })

                .on("mousemove", function (d, i) {
                    mouse = d3.mouse(this);
                    mousex = mouse[0];
                    mousey = mouse[1];
                    datearray = [];
                    var invertedx = x.invert(mousex);
                    invertedx = invertedx.getHours();
                    var selected = (d.values);
                    for (var k = 0; k < selected.length; k++) {
                        datearray[k] = selected[k].date
                        datearray[k] = datearray[k].getHours();
                    }
                    mousedate = datearray.indexOf(invertedx);
                    if (mousedate > 3 || mousedate==-1)
                        mousedate = 3;
                    pro = d.values[mousedate].value;


                    // Display mouse pointer
                    hoverPointer
                        .attr("x", mousex - 3)
                        .attr("y", mousey - 6)
                        .style("opacity", 1);

                    hoverLine
                        .attr("x1", mousex)
                        .attr("x2", mousex)
                        .style("opacity", 1);

                    //
                    // Tooltip
                    //

                    // Tooltip data
                    tooltip.html(settings.toolTipFun(d))
                    .style("display", "block");

                    // Tooltip arrow
                    tooltip.append('div').attr('class', 'd3-tip-arrow');
                })

                .on("mouseout", function (d, i) {

                    // Revert full opacity to all paths
                    svg.selectAll(".streamgraph-layer")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);

                    // Hide cursor pointer
                    hoverPointer.style("opacity", 0);

                    // Hide tooltip
                    tooltip.style("display", "none");

                    hoverLine.style("opacity", 0);
                });
        });
    // Append events to the chart container
    // ------------------------------
       d3Container
            .on("mousemove", function (d, i) {
                mouse = d3.mouse(this);
                mousex = mouse[0];
                mousey = mouse[1];

                // Display hover line
                //.style("opacity", 1);


                // Move tooltip vertically
                tooltip.style("top", (mousey - ($('.d3-tip').outerHeight() / 2)) - 2 + "px") // Half tooltip height - half arrow width

                // Move tooltip horizontally
                if (mousex >= ($(element).outerWidth() - $('.d3-tip').outerWidth() - margin.right - (tooltipOffset * 2))) {
                    tooltip
                        .style("left", (mousex - $('.d3-tip').outerWidth() - tooltipOffset) + "px") // Change tooltip direction from right to left to keep it inside graph area
                        .attr("class", "d3-tip w");
                }
                else {
                    tooltip
                        .style("left", (mousex + tooltipOffset) + "px")
                        .attr("class", "d3-tip e");
                }
            });
       $(window).on('resize', resizeStream);

    // Call function on sidebar width change
       $('.sidebar-control').on('click', resizeStream);

       function resizeStream() {

           // Layout
           // -------------------------

           // Define width
           width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;

           // Main svg width
           container.attr("width", width + margin.left + margin.right);

           // Width of appended group
           svg.attr("width", width + margin.left + margin.right);

           // Horizontal range
           x.range([0, width]);


           // Chart elements
           // -------------------------

           // Horizontal axis
           svg.selectAll('.d3-axis-horizontal').call(xAxis);

           // Horizontal axis subticks
           svg.selectAll('.d3-axis-subticks').attr("x1", x).attr("x2", x);

           // Grid lines width
           svg.selectAll(".d3-grid-dashed").call(gridAxis.tickSize(-width, 0, 0))

           // Right vertical axis
           svg.selectAll(".d3-axis-right").attr("transform", "translate(" + width + ", 0)");

           // Area paths
           svg.selectAll('.streamgraph-layer').attr("d", function (d) { return area(d.values); });
       }
       return this;
};

$.fn.waterFall = function(options) {
    var Args = {
        data: [],
        colorrange: ['#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE'],
        padding:.09,
        margin: { top: 5, right: 50, bottom: 40, left: 50 },
        //  width:400,
        height: 800,
        yAxisFormat: function (n) {
            n = Math.round(n);
            var result = n;
            if (Math.abs(n) > 1000) {
                result = Math.round(n / 1000) + 'K';
            }
            return '$' + result;
        },
        xAxisFormat: function (d) { return (d) + "k"; },
       element: '#' + this[0].id

    };

    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;

    $(settings.element).data(settings);

    // Basic setup
    // ------------------------------

    // Define main variables
    var d3Container = d3.select(element),
        //margin = { top: 5, right: 10, bottom: 100, left: 50 },
        width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
        height = settings.height - settings.margin.top - settings.margin.bottom;
//        padding = 0.3;

  

    // Construct scales
    // ------------------------------

    // Horizontal
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], settings.padding);

    // Vertical
    var y = d3.scale.linear()
        .range([height, 0]);



    // Create axes
    // ------------------------------

    // Horizontal
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // Vertical
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(settings.yAxisFormat);



    // Create chart
    // ------------------------------

    // Container
    var container = d3Container.append("svg")

    // SVG element
    var svg = container
        .attr('width', width + settings.margin.left + settings.margin.right)
        .attr("height", height + settings.margin.top + settings.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");



    // Load data
    // ------------------------------

   // d3.csv("assets/demo_data/d3/other/waterfall.csv", function (error, data) {

        // Pull out values
        settings.data.forEach(function (d) {
            d.value = +d.value;
        });

        // Transform data (i.e., finding cumulative values and total) for easier charting
        var cumulative = 0;
        for (var i = 0; i < settings.data.length; i++) {
            settings.data[i].start = cumulative;
            cumulative += settings.data[i].value;
            settings.data[i].end = cumulative;
            settings.data[i].class = (settings.data[i].value >= 0) ? 'positive' : 'negative'
        }
        settings.data.push({
            name: 'Total',
            end: cumulative,
            start: 0,
            class: 'total'
        });


        // Set input domains
        // ------------------------------

        // Horizontal
        x.domain(settings.data.map(function (d) { return d.name; }));

        // Vertical
        y.domain([0, d3.max(settings.data, function (d) { return d.end; })]);



        //
        // Append chart elements
        //

        // Append axes
        // ------------------------------

        // Horizontal
        svg.append("g")
            .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-15px")
                .attr("dy", "-6px")
                .attr("transform", function (d) {
                    return "rotate(-90)"
                });

        // Vertical
        svg.append("g")
            .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
            .call(yAxis);


        // Append bars
        // ------------------------------

        // Bind data
        var bar = svg.selectAll(".d3-waterfall-bar")
            .data(settings.data)
            .enter()
            .append("g")
                .attr("class", function (d) { return "d3-waterfall-bar " + d.class })
                .attr("transform", function (d) { return "translate(" + x(d.name) + ",0)"; });

        // Append bar rects
        bar.append("rect")
            .attr("y", function (d) { return y(Math.max(d.start, d.end)); })
            .attr("height", function (d) { return Math.abs(y(d.start) - y(d.end)); })
            .attr("width", x.rangeBand());

        // Append text
        bar.append("text")
            .attr("x", x.rangeBand() / 2)
            .attr("y", function (d) { return y(d.end) + 5; })
            .attr("dy", function (d) { return ((d.class == 'negative') ? '-' : '') + "1.5em" })
            .style("fill", "#fff")
            .style("text-anchor", "middle")
            .text(function (d) { return settings.yAxisFormat(d.end - d.start); });

        // Apply colorse
        bar.filter(function (d) { return d.class == "positive" }).select('rect').style("fill", "#EF5350");
        bar.filter(function (d) { return d.class == "negative" }).select('rect').style("fill", "#66BB6A");
        bar.filter(function (d) { return d.class == "total" }).select('rect').style("fill", "#42A5F5");

        // Add connector line
        bar.filter(function (d) { return d.class != "total" })
            .append("line")
                .attr("class", "d3-waterfall-connector")
                .attr("x1", x.rangeBand() + 5)
                .attr("y1", function (d) { return y(d.end) })
                .attr("x2", x.rangeBand() / (1 - settings.padding) - 5)
                .attr("y2", function (d) { return y(d.end) })
                .style("stroke", "#999")
                .style("stroke-dasharray", 3);
  //  });



    // Resize chart
    // ------------------------------

    // Call function on window resize
    $(window).on('resize', resize);

    // Call function on sidebar width change
    $('.sidebar-control').on('click', resize);

    // Resize function
    // 
    // Since D3 doesn't support SVG resize by default,
    // we need to manually specify parts of the graph that need to 
    // be updated on window resize
    function resize() {

        // Layout variables
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


        // Layout
        // -------------------------

        // Main svg width
        container.attr("width", width + margin.left + margin.right);

        // Width of appended group
        svg.attr("width", width + margin.left + margin.right);


        // Axes
        // -------------------------

        // Horizontal range
        x.rangeRoundBands([0, width], padding);

        // Horizontal axis
        svg.selectAll('.d3-axis-horizontal').call(xAxis).selectAll('text').style("text-anchor", "end").attr("dy", "-6px");


        // Chart elements
        // -------------------------

        // Bar group
        svg.selectAll(".d3-waterfall-bar").attr("transform", function (d) { return "translate(" + x(d.name) + ",0)"; });

        // Bar rect
        svg.selectAll(".d3-waterfall-bar rect").attr("width", x.rangeBand());

        // Bar text
        svg.selectAll(".d3-waterfall-bar text").attr("x", x.rangeBand() / 2);

        // Connector line
        svg.selectAll(".d3-waterfall-connector").attr("x1", x.rangeBand() + 5).attr("x2", x.rangeBand() / (1 - padding) - 5);
    }
}

$.fn.bubbles = function(options) {

    var Args = {
        data: [],
        colorrange: ['#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE'],
        diameter:700,
         //  width:400,
        height: 800,
        yAxisFormat: function (n) {
            n = Math.round(n);
            var result = n;
            if (Math.abs(n) > 1000) {
                result = Math.round(n / 1000) + 'K';
            }
            return '$' + result;
        },
        xAxisFormat: function (d) { return (d) + "k"; },
        element: '#' + this[0].id

    };
    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;
    $(settings.element).data(settings);
    var format = d3.format(",d");
    // Color scale
    color = d3.scale.category10();

    // Create chart
    // ------------------------------

    var svg = d3.select(element).append("svg")
        .attr("width", settings.diameter)
        .attr("height", settings.diameter)
        .attr("class", "bubble");

    // Create chart
    // ------------------------------

    // Add tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html(function (d) {
            return d.className + ": " + format(d.value);;
        });

    // Initialize tooltip
    svg.call(tip);

    // Construct chart layout
    // ------------------------------

    // Pack
    var bubble = d3.layout.pack()
        .sort(null)
        .size([settings.diameter, settings.diameter])
        .padding(1.5);

        var node = svg.selectAll(".d3-bubbles-node")
            .data(bubble.nodes(classes(settings.data))
            .filter(function (d) { return !d.children; }))
            .enter()
            .append("g")
                .attr("class", "d3-bubbles-node")
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        // Append circles
        node.append("circle")
            .attr("r", function (d) { return d.r; })
            .style("fill", function (d) { return color(d.packageName); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        // Append text
        node.append("text")
            .attr("dy", ".3em")
            .style("fill", "#fff")
            .style("font-size", 12)
            .style("text-anchor", "middle")
            .text(function (d) { return d.className.substring(0, d.r / 3); });

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) { recurse(node.name, child); });
            else classes.push({ packageName: name, className: node.name, value: node.size });
        }

        recurse(null, root);
        return { children: classes };
    }
}

$.fn.treeCollapsible = function(options) {

    var Args = {
        data: [],
        margin:{ top: 0, right: 0, bottom: 0, left: 40 },
        height: 500,

    };
    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;
    $(settings.element).data(settings);
    // Basic setup
    // ------------------------------

    // Define main variables
    var d3Container = d3.select(element),
        width = d3Container.node().getBoundingClientRect().width - settings.margin.left - settings.margin.right,
        height = settings.height - settings.margin.top - settings.margin.bottom - 5,
        i = 0,
        root;
    var container = d3Container.append("svg");

    // Add SVG group
    var svg = container
        .attr("width", width + settings.margin.left + settings.margin.right)
        .attr("height", height + settings.margin.top + settings.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");



    var tree = d3.layout.tree()
        .size([height, width - 180]);

    // Diagonal projection
    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

        root = settings.data;
        root.x0 = height / 2;
        root.y0 = 0;

        // Toggle nodes function
        function toggleAll(d) {
            if (d.children) {
                d.children.forEach(toggleAll);
                toggle(d);
            }
        }

        // Initialize the display to show a few nodes
        root.children.forEach(toggleAll);
        toggle(root.children[1]);
        toggle(root.children[1].children[2]);
        toggle(root.children[9]);
        toggle(root.children[9].children[0]);

        update(root);
  
    function update(source) {

        // Set duration
        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse();

        // Normalize for fixed-depth.
        //nodes.forEach(function(d) { d.y = d.depth * 250; });

        // Update the nodes…
        var node = svg.selectAll(".d3-tree-node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });


        // Enter nodes
        // ------------------------------

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "d3-tree-node")
            .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function (d) { toggle(d); update(d); });

        // Add node circles
        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", "#fff")
            .style("stroke", "#2196F3")
            .style("stroke-width", 1.5)
            .style("cursor", "pointer")
            .style("fill", function (d) { return d._children ? "#2196F3" : "#fff"; });

        // Add nodes text
        nodeEnter.append("text")
            .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .style("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
            .style("font-size", 12)
            .style("fill-opacity", 1e-6)
            .text(function (d) { return d.name; });


        // Update nodes
        // ------------------------------

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

        // Update circle
        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) { return d._children ? "#2196F3" : "#fff"; });

        // Update text
        nodeUpdate.select("text")
            .style("fill-opacity", 1);


        // Exit nodes
        // ------------------------------

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit()
            .transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

        // Update circles
        nodeExit.select("circle")
            .attr("r", 1e-6);

        // Update text
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);


        // Links
        // ------------------------------

        // Update the links…
        var link = svg.selectAll(".d3-tree-link")
            .data(tree.links(nodes), function (d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "d3-tree-link")
            .style("fill", "none")
            .style("stroke", "#ddd")
            .style("stroke-width", 1.5)
            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            })
            .transition()
                .duration(duration)
                .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        // Resize chart
        // ------------------------------

        // Call function on window resize
        $(window).on('resize', resize);

        // Call function on sidebar width change
        $('.sidebar-control, .d3-tree-node circle').on('click', resize);


        // Resize function
        // 
        // Since D3 doesn't support SVG resize by default,
        // we need to manually specify parts of the graph that need to 
        // be updated on window resize
        function resize() {

            // Layout variables
            width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
            nodes = tree.nodes(root),
            links = tree.links(nodes);

            // Layout
            // -------------------------

            // Main svg width
            container.attr("width", width + margin.left + margin.right);

            // Width of appended group
            svg.attr("width", width + margin.left + margin.right);


            // Tree size
            tree.size([height, width - 180]);

            diagonal.projection(function (d) { return [d.y, d.x]; });


            // Chart elements
            // -------------------------

            // Link paths
            svg.selectAll(".d3-tree-link").attr("d", diagonal)

            // Node paths
            svg.selectAll(".d3-tree-node").attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });
        }
    }

    // Toggle childrens
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;
        }
    }



}

$.function.lineBasic = function (Args) {
    var Args = {
        data: [],
        margin: { top: 0, right: 0, bottom: 0, left: 40 },
        height: 500,

    };
    var settings = $.extend({}, Args, options);
    var element = '#' + this[0].id;
    $(settings.element).data(settings);

    // Basic setup
    // ------------------------------

    // Define main variables
    var d3Container = d3.select(settings.data),
        margin = { top: 5, right: 20, bottom: 20, left: 40 },
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
        height = height - margin.top - margin.bottom - 5;

    // Format data
     //parseDate = d3.time.format("%d-%b-%y").parse,
      var  bisectDate = d3.bisector(function (d) { return d.date; }).left,
        formatValue = d3.format(",.2f"),
        formatCurrency = function (d) { return "$" + formatValue(d); }



    // Construct scales
    // ------------------------------

    // Horizontal
    var x = d3.time.scale()
        .range([0, width]);

    // Vertical
    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6)
        .tickFormat(d3.time.format("%b"));

    // Vertical
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");



    // Create chart
    // ------------------------------

    // Add SVG element
    var container = d3Container.append("svg");

    // Add SVG group
    var svg = container
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // Construct chart layout
    // ------------------------------

    // Line
    var line = d3.svg.line()
        .interpolate("basis")
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.close); });



    // Load data
    // ------------------------------

 //   d3.tsv("assets/demo_data/d3/lines/lines_basic.tsv", function (error, data) {

        // Pull out values
        settins.data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });
         settings.data.sort(function (a, b) {
            return a.date - b.date;
        });

        x.domain(d3.extent(data, function (d) { return d.date; }));
       y.domain([0, d3.max(data, function (d) { return d.close; })]);
       svg.append("path")
            .datum(data)
                .attr("class", "d3-line d3-line-medium")
                .attr("d", line)
                .style("fill", "none")
                .style("stroke-width", 2)
                .style("stroke", "#4CAF50");

        svg.append("g")
            .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var verticalAxis = svg.append("g")
            .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
            .call(yAxis);

        verticalAxis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "#999")
            .style("font-size", 12)
            .text("Price ($)");

        var focus = svg.append("g")
            .attr("class", "d3-crosshair-pointer")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 3.5)
            .style("fill", "#fff")
            .style("stroke", "#4CAF50")
            .style("stroke-width", 2);

        focus.append("text")
            .attr("dy", ".35em")
            .style("fill", "#333")
            .style("stroke", "none")

        svg.append("rect")
            .attr("class", "d3-crosshair-overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
            focus.select("text").text(formatCurrency(d.close)).attr("dx", -26).attr("dy", 30);
        }
   
    $(window).on('resize', resize);

    // Call function on sidebar width change
    $('.sidebar-control').on('click', resize);


    function resize() {

        // Layout variables
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;

        container.attr("width", width + margin.left + margin.right);

        // Width of appended group
        svg.attr("width", width + margin.left + margin.right);

        x.range([0, width]);

        svg.selectAll('.d3-axis-horizontal').call(xAxis);

        svg.selectAll('.d3-line').attr("d", line);

        // Crosshair
        svg.selectAll('.d3-crosshair-overlay').attr("width", width);
    }
}