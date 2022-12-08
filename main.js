// let url = 'https://opendata.muenchen.de/dataset/3621ad08-aa97-4c2b-b0b0-82780375743c/resource/4f00274a-ef75-41e5-b5c1-15f22c9f8a12/download/monatszahlen2209_tourismus.csv';
let url = 'https://raw.githubusercontent.com/erdermus/erdermus.github.io/main/tourismus.csv?token=GHSAT0AAAAAAB4EUH4OUPS52IWXVXBHNDAKY4SG3KQ';

let margin = {top: 50, right: 50, bottom: 50, left: 50};
let width = 800;
let height = 400;

let svg = d3.select('#tour19')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

d3.csv(url).then(function(data){
    data.forEach(function(d){ 
        d['JAHR'] = +d['JAHR'];
        d['MONAT'] = +d['MONAT'];
        d['WERT'] = +d['WERT']; 
    });
    let selectedData = data.filter(function (d) {
        return d.JAHR >= 2018 &&
        !isNaN(d.MONAT) &&
        d.AUSPRÄGUNG == 'insgesamt';
    });

    data = selectedData.filter( d => d.JAHR == 2018 && d.MONATSZAHL == 'Gäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})

    let groups = [2018, 2019, 2020, 2021, 2022];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    d3.select('#year-select')
        .selectAll('myOptions')
        .data(groups)
        .enter()
        .append('option')
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    let x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.MONAT; }))
        .padding(0.2);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((d,i) => months[i]))
        .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');
    
    let y = d3.scaleLinear()
        .domain([0, 1500000])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    svg.selectAll('mybar')
        .data(data)
        .enter()
        .append('rect')
            .attr('x', function(d) { return x(d.MONAT); })
            .attr('y', function(d) { return y(d.WERT); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return height - y(d.WERT); })
            .attr('fill', '#B0ABF1');

    function update(selectedYear) {
        let dataFilter = selectedData.filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Gäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})

        let newbar = svg.selectAll('rect')
            .data(dataFilter);

        newbar.enter()
            .append('rect')
            .merge(newbar)
            .transition()
            .duration(1000)
                .attr('class', 'rect')
                // .attr('x', function(d) { return x(+d.MONAT) })
                .attr('y', function(d) { return y(+d.WERT) })
                .attr('width', x.bandwidth())
                .attr('height', function(d) { return height - y(d.WERT); })
                .attr('fill', '#B0ABF1');

        newbar.exit().remove();
    }
    
    d3.select('#year-select').on('change', function(d) {
        let selectedYear = d3.select(this).property('value')
        update(selectedYear)
    });

    update(2018);
    svg.node();
});