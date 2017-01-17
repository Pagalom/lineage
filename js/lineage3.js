function start() {

  var svg = d3.select("svg");
      width = window.innerWidth,
      height = window.innerHeight,
      color = d3.scaleOrdinal(d3.schemeCategory20);

  var nodes = [],
      links = [],
      allData = {};

  var svg = d3.select("svg")
      .attr("id", "screen")
      .attr("width", width)
      .attr("height", height);

  var year = 2015;
  var filters = "Garvey Haley Innes Zappasodi Fales Quinn Corcoran Owens Delpino Patterson Waite Dokmanus Pedersen Turner Dvorak Fucetola Phero Penza Koch Hackeloer Ferguson Anderson Supalo Perrin Bristow Loffredo King Carnesale".split(" ");
  //filters = [];

  function getNodeById(nodes, id) {
    for(i=0; i<nodes.length; i++) {
      if (nodes[i].id === id) {
        return nodes[i];
      }
    }
    return -1;
  }

  d3.json("data/converted.json", function(error, data) {
    if (error) throw error;

    allData = data;

    // link directly instead of using indices
    allData.links.forEach( function(link, index) {
      link.source = getNodeById(allData.nodes, link.source);
      link.target = getNodeById(allData.nodes, link.target);
    });

    nodes = []; //data.nodes;
    links = []; // data.links;

    var simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody(1))
      .force("center", d3.forceCenter())
      .force("link", d3.forceLink(links))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaTarget(1)
      .on("tick", ticked);

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
        link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
        node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

    restart();

    d3.interval(function() {
      //year += 1;
      // push any new ones we need
      allData.nodes.forEach( function(n) {
          if (nodes.indexOf(n) == -1 && new Date(n.birthDate).getFullYear() <= year && inFilter(n)) {
            nodes.push(n);
          }
          else if (nodes.indexOf(n) > -1 && (new Date(n.birthDate).getFullYear() >= year || !inFilter(n))) {
            nodes.splice(nodes.indexOf(n), 1);
          }
        }
      );

      // pop off any ones we don't
      visibleNodeMap = nodes.map(function(node) { return node.id });

      // Only show links with both source and target
      allData.links.forEach( function(l) {
        if (links.indexOf(l) == -1 && nodes.indexOf(l.source) > -1 && nodes.indexOf(l.target) > -1) {
          links.push(l);
        }
        else if (links.indexOf(l) > -1 && (nodes.indexOf(l.source) == -1 || nodes.indexOf(l.target) == -1)) {
          links.splice(links.indexOf(l), 1);
        }
      });

      restart();

    }, 1000, d3.now());

    function restart() {
      console.log("restarted ", year);
      // Apply the general update pattern to the nodes.
      node = node.data(nodes, function(d) { return d.id;});
      node.exit().remove();
      node = node.enter()
        .append("circle")
        .attr("fill", function(d) { return color(d.lastName); })
        .attr("r", 5)
        .attr("x", width/2)
        .attr("y", height/2)
        .merge(node)
        .call(d3.drag()
          .on("start", function(d) {dragstarted(d, simulation);})
          .on("drag", dragged)
          .on("end", function(d) {dragended(d, simulation);}));

      node.append("title")
        .text(function(d) { return d.name; });

      // Apply the general update pattern to the links.
      link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
      link.exit().remove();
      link = link.enter()
        .append("line")
        .style("stroke-width", 1)
        .style("stroke", function(d) { return d.color; })
        .merge(link);

      // Update and restart the simulation.
      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart();
    }

    function ticked() {
      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })

      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    }
  });

  function inFilter(node) {
    if (filters == "") {
      return true;
    }

    var regex = null;
    for(i=0; i<filters.length; i++) {
      regex = new RegExp(filters[i], 'ig');
      if (node.name.match(regex)) {
        return true;
      }
    }
    return false;
  }

  function dragstarted(d, sim) {
    if (!d3.event.active) sim.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d, sim) {
    if (!d3.event.active) sim.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
