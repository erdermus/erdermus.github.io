let tourismus = 'https://erdermus.github.io/tourismus.csv';
let flugverkehr = 'https://erdermus.github.io/flugverkehr.csv';
let arbeitsmarkt = 'https://erdermus.github.io/arbeitsmarkt.csv';

let margin = {top: 50, right: 50, bottom: 50, left: 50};
let width = 600;
let height = 400;

let svg = d3.select('#tourism-data')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

let svg2 = d3.select('#air-data')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(${60}, ${margin.top-margin.bottom})`);

Promise.all([
    d3.csv(tourismus),
    d3.csv(flugverkehr),
    d3.csv(arbeitsmarkt)
]).then(function(data){
    // data = [tourismus-data, flugverkehr-data, arbeitsmarkt-data]

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
    console.log(selectedData)

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
    console.log(data)

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    
    let y = d3.scaleLinear()
        .domain([0, 1500000])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    svg.selectAll('mybar')
        .data(data[0])
        .enter()
        .append('rect')
            .attr('x', function(d) { return x(d.MONAT); })
            .attr('y', function(d) { return y(d.WERT); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return height - y(d.WERT); })
            .attr('fill', '#B0ABF1');

    function update(selectedYear) {
        let dataFilter1 = selectedData[0].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Gäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})
        let dataFilter2 = selectedData[1].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Fluggäste').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})
        let dataFilter3 = selectedData[2].filter( d => d.JAHR == selectedYear && d.MONATSZAHL == 'Arbeitslose').map(function(d) {return {MONAT: d.MONAT, WERT: d.WERT}})

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