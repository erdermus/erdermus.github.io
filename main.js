let tourismus = 'https://erdermus.github.io/tourismus.csv';
let flugverkehr = 'https://erdermus.github.io/flugverkehr.csv';
let arbeitsmarkt = 'https://erdermus.github.io/arbeitsmarkt.csv';

let margin = {top: 50, right: 50, bottom: 50, left: 50};
let width = 600;
let height = 400;

// svg [plot] for trousim-data
let svg = d3.select('#tourism-data')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

// svg [plot] for air-data
let svg2 = d3.select('#air-data')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

// svg [plot] for market-data
let svg3 = d3.select('#market-data')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

// load all csv-data files and stores it into parameter 'data' -> data = [tourismus, flugverkehr, arbeitsmarkt]
Promise.all([
    d3.csv(tourismus),
    d3.csv(flugverkehr),
    d3.csv(arbeitsmarkt)
]).then(function(data){
    // transform for each data the string values into actuel numbers
    data.forEach( d => {
        d.forEach( da => {
            da['JAHR'] = +da['JAHR'];
            da['MONAT'] = +da['MONAT'];
            da['WERT'] = +da['WERT'];
        });
    });

    // filter the data for the time period after 2019 and for 'insgesamt'
    let selectedData = [];
    data.forEach( (d, i) => {
        selectedData[i] = d.filter( da => {
            return da.JAHR >= 2019 &&
            !isNaN(da.MONAT) &&
            da.AUSPRÄGUNG == 'insgesamt';
        });
    });

    // filter and select the actual data to visualize
    data.forEach( (d, i) => {
        if (i === 0) {
            data[i] = selectedData[0].filter( da => da.JAHR == 2019 && da.MONATSZAHL == 'Gäste').map( da => {return {MONAT: da.MONAT, WERT: da.WERT}})
        } else if (i === 1) {
            data[i] = selectedData[1].filter( da => da.JAHR == 2019 && da.MONATSZAHL == 'Fluggäste').map( da => {return {MONAT: da.MONAT, WERT: da.WERT}});
        } else if (i === 2) {
            data[i] = selectedData[2].filter( da => da.JAHR == 2019 && da.MONATSZAHL == 'Arbeitslose').map( da => {return {MONAT: da.MONAT, WERT: da.WERT}});
        }
    });

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // x Axis for tourism-data
    let x = d3.scaleBand()
        .range([0, width])
        .domain(data[0].map(function(d) { return d.MONAT; }))
        .padding(0.2);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((d,i) => months[i]))
        .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');
    // y Axis for tourism-data
    let y = d3.scaleLinear()
        .domain([0, 1500000])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));
    // add all attributes to plot
    svg.selectAll('mybar')
        .data(data[0])
        .enter()
        .append('rect')
            .attr('x', function(d) { return x(d.MONAT); })
            .attr('y', function(d) { return y(d.WERT); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return height - y(d.WERT); })
            .attr('fill', '#B0ABF1');

    // x Axis for air-data
    let x2 = d3.scaleBand()
        .range([0, width])
        .domain(data[1].map(function(d) { return d.MONAT; }))
        .padding(0.2);
    svg2.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x2).tickFormat((d,i) => months[i]))
        .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end')
    // y Axis for air-data
    let y2 = d3.scaleLinear()
        .domain([0, 4900000])
        .range([height, 0]);
    svg2.append('g')
        .call(d3.axisLeft(y2))
    // add all attributes to plot
    svg2.selectAll('mybar')
        .data(data[1])
        .enter()
        .append('rect')
            .attr('x', function(d) { return x2(d.MONAT); })
            .attr('y', function(d) { return y2(d.WERT); })
            .attr('width', x2.bandwidth())
            .attr('height', function(d) { return height - y2(d.WERT); })
            .attr('fill', '#44CBEC');

    // x Axis for market-data
    let x3 = d3.scaleBand()
        .range([0, width])
        .domain(data[2].map(function(d) { return d.MONAT; }))
        .padding(0.2);
    svg3.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x3).tickFormat((d,i) => months[i]))
        .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end')
    // y Axis for market-data
    let y3 = d3.scaleLinear()
        .domain([0, 49000])
        .range([height, 0]);
    svg3.append('g')
        .call(d3.axisLeft(y3))
    // add all attributes to plot
    svg3.selectAll('mybar')
        .data(data[2])
        .enter()
        .append('rect')
            .attr('x', function(d) { return x3(d.MONAT); })
            .attr('y', function(d) { return y3(d.WERT); })
            .attr('width', x3.bandwidth())
            .attr('height', function(d) { return height - y3(d.WERT); })
            .attr('fill', '#60AB9A');
    
    // update bar plots after new year has been selected
    function update(selectedYear) {
        // filter data for new selected year
        let dataFilter1 = selectedData[0].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Gäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})
        let dataFilter2 = selectedData[1].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Fluggäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})
        let dataFilter3 = selectedData[2].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Arbeitslose').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})

        // update bar plot for tourism-data
        let newbar = svg.selectAll('rect')
            .data(dataFilter1);
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

        // update bar plot for air-data
        let newbar2 = svg2.selectAll('rect')
            .data(dataFilter2);
        newbar2.enter()
            .append('rect')
            .merge(newbar2)
            .transition()
            .duration(1000)
                .attr('class', 'rect')
                .attr('y', function(d) { return y2(+d.WERT) })
                .attr('width', x2.bandwidth())
                .attr('height', function(d) { return height - y2(d.WERT); })
                .attr('fill', '#44CBEC');
        newbar2.exit().remove();

        // update bar plot for market-data
        let newbar3 = svg3.selectAll('rect')
            .data(dataFilter3);
        newbar3.enter()
            .append('rect')
            .merge(newbar3)
            .transition()
            .duration(1000)
                .attr('class', 'rect')
                .attr('y', function(d) { return y3(+d.WERT) })
                .attr('width', x3.bandwidth())
                .attr('height', function(d) { return height - y3(d.WERT); })
                .attr('fill', '#60AB9A');
        newbar3.exit().remove();
    }
    
    d3.select('#years').on('change', function(d) {
        let selectedYear = d3.select(this).property('value')
        update(selectedYear)
    });

    update(2019);
    svg.node();
});

function selectedYear(elem) {
    let options = document.getElementById('tickyear').getElementsByTagName('option');
    let value = [];
    for (let i = 0; i < options.length; i+=1) {
        value.push(options[i].value);
    }
    const result = document.querySelector('.year-content');
    result.textContent = elem.value;
    const log = document.getElementById('log');
    //if (value.indexOf(elem.value) > -1) {
    //    console.log(elem.value);
    //}
}