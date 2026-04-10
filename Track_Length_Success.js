const spotify = d3.csv("spotify_duration_summary.csv");

spotify.then(function(data) {

    data.forEach(function(d) {
        d.songs = +d.songs;
        d.average_popularity = +d.average_popularity;
    });

    const width = 700, height = 320;
    const margin = {top: 40, bottom: 55, left: 80, right: 40};

    const svg = d3.select("#d3-track-length-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#f5f0ff");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#111")
        .text("Average Song Popularity by Track Length Group");

    const x = d3.scaleBand()
        .domain(data.map(d => d.duration_bin))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.average_popularity)])
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.duration_bin))
        .range(["#e0ccff", "#d6b8ff", "#b266ff", "#8a33cc", "#5a0099"]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    xAxis.selectAll("text")
        .style("text-anchor", "middle")
        .style("fill", "#222")
        .style("font-size", "12px");

    xAxis.selectAll("path, line")
        .style("stroke", "#222");

    const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    yAxis.selectAll("text")
        .style("fill", "#222")
        .style("font-size", "12px");

    yAxis.selectAll("path, line")
        .style("stroke", "#222");

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("font-size", "12px")
        .style("padding", "6px")
        .style("border", "1px solid #999")
        .style("visibility", "hidden");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.duration_bin))
        .attr("y", d => y(d.average_popularity))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.average_popularity))
        .attr("fill", d => color(d.duration_bin))

        .on("mouseover", function(event, d) {
            tooltip
                .style("visibility", "visible")
                .html(
                    "Track length: " + d.duration_bin + "<br>" +
                    "Average popularity: " + d.average_popularity + "<br>" +
                    "Songs: " + d.songs
                );
        })

        .on("mousemove", function(event) {
            tooltip
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })

        .on("mouseout", function() {
            tooltip
                .style("visibility", "hidden");
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .style("fill", "#111")
        .text("Track Length Group");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 30)
        .style("text-anchor", "middle")
        .style("fill", "#111")
        .text("Average Popularity Score");

});
