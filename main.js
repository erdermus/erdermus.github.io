let tourism = 'https://erdermus.github.io/tourism.csv';
let ubernacht_2020 = 'https://erdermus.github.io/2020-ubernacht.csv';
let ubernacht_2019 = 'https://erdermus.github.io/2019-ubernacht.csv';

let margin = {top: 100, right: 50, bottom: 50, left: 60};
let selectedYear = 2019;
let currentState = '';
let currentAnkunft = 0;
let currentUebernachtung = 0;
let avgUebernachtung = 0;

var width = 960,
    height = 500,
    focused = null,
    geoPath;
  
var svg = d3.select("body")
    .append("svg")
      .attr("width", width)
      .attr("height", height);
    
var g = svg.append("g")
    .append("g")
      .attr("id", "states");  
  
d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/1_sehr_hoch.geo.json", function(collection) {
  
    var bounds = d3.geo.bounds(collection),
        bottomLeft = bounds[0],
        topRight = bounds[1],
        rotLong = - (topRight[0] + bottomLeft[0]) / 2,
        center = [(topRight[0] + bottomLeft[0]) / 2 + rotLong, (topRight[1] + bottomLeft[1]) / 2],

        projection = d3.geo.albers()
            .parallels([bottomLeft[1], topRight[1]])
            .rotate([rotLong, 0, 0])
            .translate([width / 2, height / 2])
            .center(center),
          
        bottomLeftPx = projection(bottomLeft),
        topRightPx = projection(topRight),
        scaleFactor = 1.00 * Math.min(width / (topRightPx[0] - bottomLeftPx[0]), height / (- topRightPx[1] + bottomLeftPx[1])),
        
        projection = d3.geo.albers()
            .parallels([bottomLeft[1], topRight[1]])
            .rotate([rotLong, 0, 0])
            .translate([width / 2, height / 2])
            .scale(scaleFactor * 0.975 * 1000)
            .center(center);
  
    geoPath = d3.geo.path().projection(projection);
      
    g.selectAll("path.feature")
            .data(collection.features)
            .enter()
        .append("path")
            .attr("class", "feature")
            .attr("d", geoPath)
            .on("click", function(d){
                currentState = d.properties.name;
                d3.csv(tourism, function(data) {
                    data.forEach( bundesland => {
                        if (bundesland.Label == d.properties.name && selectedYear == bundesland.Zeit) {
                            bundesland['Ankuenfte'] = +bundesland['Ankuenfte'];
                            bundesland['Uebernachtungen'] = +bundesland['Uebernachtungen'];
                            currentAnkunft = bundesland.Ankuenfte;
                            currentUebernachtung = bundesland.Uebernachtungen;
                        }
                    })
                    if (selectedYear == 2019) {
                        d3.csv(ubernacht_2019, function(data1) {
                            data1.forEach( bundesland => {
                                if (bundesland.Label == d.properties.name) {
                                    bundesland['Wert'] = +bundesland['Wert'];
                                    avgUebernachtung = bundesland.Wert;
                                }
                            })
                            changeState();
                        })
                    } else if (selectedYear == 2020) {
                        d3.csv(ubernacht_2020, function(data2) {
                            data2.forEach( bundesland => {
                                if (bundesland.Label == d.properties.name) {
                                    bundesland['Wert'] = +bundesland['Wert'];
                                    avgUebernachtung = bundesland.Wert;
                                }
                            })
                            changeState();
                        })
                    }
                })

                d3.select('#years').on('change', function(foo) {
                    selectedYear = d3.select(this).property('value')
                    d3.csv(tourism, function(data) {
                        data.forEach( bundesland => {
                            if (bundesland.Label == d.properties.name && selectedYear == bundesland.Zeit) {
                                bundesland['Ankuenfte'] = +bundesland['Ankuenfte'];
                                bundesland['Uebernachtungen'] = +bundesland['Uebernachtungen'];
                                currentAnkunft = bundesland.Ankuenfte;
                                currentUebernachtung = bundesland.Uebernachtungen;
                            }
                        })
                        if (selectedYear == 2019) {
                            d3.csv(ubernacht_2019, function(data1) {
                                data1.forEach( bundesland => {
                                    if (bundesland.Label == d.properties.name) {
                                        bundesland['Wert'] = +bundesland['Wert'];
                                        avgUebernachtung = bundesland.Wert;
                                    }
                                })
                                changeState();
                            })
                        } else if (selectedYear == 2020) {
                            d3.csv(ubernacht_2020, function(data2) {
                                data2.forEach( bundesland => {
                                    if (bundesland.Label == d.properties.name) {
                                        bundesland['Wert'] = +bundesland['Wert'];
                                        avgUebernachtung = bundesland.Wert;
                                    }
                                })
                                changeState();
                            })
                        }
                    })
                });
                var x = width/2,
                    y = height/2,
                    k = 1,
                    name = d.properties.name;

                g.selectAll("text")
                    .remove();
                if ((focused === null) || !(focused === d)) {
                    var centroid = geoPath.centroid(d),
                        x = +centroid[0],
                        y = +centroid[1],
                        k = 1.75;
                        focused = d;
    
                g.append("text")
                    .text(name)
                    .attr("x", x)
                    .attr("y", y)
                    .style("text-anchor","middle")
                    .style("font-size","8px")
                    .style("stroke-width","0px")
                    .style("fill","black")
                    .style("font-family","Times New Roman")
                    .on("click", function(da){
                        focused = null;
                        g.selectAll("text")
                            .remove();
                        g.selectAll("path")
                            .classed("active", 0);
                        g.transition()
                            .duration(1000)
                            .attr("transform", "scale("+1+")translate("+0+","+0+")")
                            .style("stroke-width", 1.00+"px");
                        currentAnkunft = 0;
                        currentUebernachtung = 0;
                        avgUebernachtung = 0;
                        currentState = '';
                        changeState();
                    });
                } else {
                    focused = null;
                    currentAnkunft = 0;
                    currentUebernachtung = 0;
                    avgUebernachtung = 0;
                    currentState = '';
                    changeState();
                };

                g.selectAll("path")
                    .classed("active", focused && function(d) { return d === focused; });
 
                g.transition()
                    .duration(1000)
                    .attr("transform", "translate("+ (width/2) +","+ (height/2) +")scale("+ k +")translate("+ (-x) +","+ (-y) +")")
                    .style("stroke-width", 1.75/k +"px");
            });
});

function changeState() {
    const federal = document.querySelector('.federal-content');
    const ankunft = document.querySelector('.ankunft-content');
    const uebernacht = document.querySelector('.uebernachtung-content');
    const avg = document.querySelector('.avg-content');
    federal.textContent = currentState;
    ankunft.textContent = "Ankünfte: " + currentAnkunft;
    uebernacht.textContent = "Übernachtunge: " + currentUebernachtung;
    avg.textContent = "durchschnittlich übernachtete Tage: " + avgUebernachtung;
}