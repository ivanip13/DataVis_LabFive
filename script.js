function update(information, type, sort){
    if (sort){
      information.sort((a,b) => a[type]-b[type]).reverse();
    }
    else {
      information.sort((a,b) => a[type]-b[type]);
    }

    xScale.domain(
      information.map(function(d) {
        return d.company;
      })
    );

    yScale.domain([0,d3.max(information.map(d=> d[type]))]);

    const bars = svg.selectAll(".bar")
      .data(information);

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return xScale(d.company);
      })
      .attr("y", function(d) {
        return yScale(d[type]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(d[type]);
      })
      .merge(bars)
      .transition()
      .delay(200)
      .duration(1000)
      .attr("class", "bar")
      .attr("x", function(d) {
        return xScale(d.company);
      })
      .attr("y", function(d) {
        return yScale(d[type]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(d[type]);
      })



    bars.exit()
    .transition()
    .duration(1000)

    .remove();

    const xAxis = d3.axisBottom().scale(xScale);

    const yAxis = d3.axisLeft().scale(yScale);

    svg.select(".yAxis")
        .transition()
        .duration(500)
        .call(yAxis);

    svg.select(".xAxis")
          .transition()
          .call(xAxis);


    svg.select(".yLabel")
        .text((d) =>{
            if (type == "stores") {
              return "Stores"
            }
            else {
              return "Billion USD"
            } ;
        });
}

  const margin = {top: 20, right: 20, bottom: 20, left: 40};

  const width = 650 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  const xScale = d3.scaleBand()
   .range([0, width])
   .paddingInner(0.1);

   const yScale = d3.scaleLinear()
    .range([height, 0]);

    svg.append("text")
    .attr("class", "yLabel")
    .attr("text-anchor", "start")
    .attr("x", -margin.left)
    .attr("y", -5);


    svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")

    svg.append("g")
    .attr("class", "yAxis")

    let type = 'stores';
    let sort = true;


  d3.csv('coffee-house-chains.csv', d3.autoType)
    .then(data=>{
      information = data;
        update(information, type, sort);

        d3.select(".button").on("click", () =>{
            sort = !sort;
            update(information, type, sort);
        });
        d3.select("#form-control").on("change", (d) => {
                type = d.target.value;
                update(information, type, sort);
        });
    });
