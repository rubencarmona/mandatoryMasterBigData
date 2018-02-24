// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendChartBars();

// 1. let's start by selecting the SVG Node
/*
function setupCanvasSize() {
  margin = {top: 0, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 120 - margin.top - margin.bottom;
}
*/

function setupCanvasSize() {
    margin = {top: 50, left: 200, bottom: 50, right: 60};
    width = 750;
    height = 300;
  }

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupXScale()
{
    x = d3.scaleBand()
        .rangeRound([0,width])
        .domain(totalSales.map(function(d, i) {
            return d.product;
        }));
}

function setupYScale()
{
    var maximumSales = d3.max(totalSales, function(d, i) {
        return d.sales;
    });

    y = d3.scaleLinear()
        .range([0, height])
        .domain([maximumSales, 0]);
}

/*
function setupXScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  x = d3.scaleLinear()
    .range([0, width])
    .domain([0, maxSales]);

}
*/

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names

/*
function setupYScale()
{
  y = d3.scaleBand()
    .rangeRound([0, height])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }));
}
*/

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}

function appendChartBars()
{
  // 2. Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect')
    .data(totalSales);


    // Now it's time to append to the list of Rectangles we already have
    var newRects = rects.enter();

    // Let's append a new Rectangles
    // UpperCorner:
    //    Starting x position, the start from the axis
    //    Starting y position, where the product starts on the y scale
    // React width and height:
    //    height: the space assign for each entry (product) on the Y axis
    //    width: Now that we have the mapping previously done (linear)
    //           we just pass the sales and use the X axis conversion to
    //           get the right value
    //       .attr('y', y(0))
    newRects.append('rect')
      .attr('y', function(d,i) {
          return y(d.sales);
      })
      .attr('x', function(d, i) {
        return x(d.product);
      })
      .attr('height', function(d, i) {
          return height - y(d.sales);
      })
      .attr('width', function(d, i) {
          return x.bandwidth() - 5;
      })
      .style('fill', function(d, i) {
          return d.color
      });
}


    /*
    var legend = svg.selectAll('.legend')
    .enter().data(totalSales)
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0, ${width} + 10)`);

    legend.append("rect")
        .attr("x", 'width' - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {
            return d.color
        });

    legend.append("text")
        .attr("x", 'width' - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d, i) { return d.product; });
    */
