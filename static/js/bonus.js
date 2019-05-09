function gaugeChart(data){

    // Enter a speed between 0 and WFREQ
    const level = data.WFREQ;

    // Trig to calc meter point
    const degrees = 180 - (level*20),
        radius = .7;
    const radians = degrees * Math.PI / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
    x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
    { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    rotation: 90,
    text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
                'Slow', 'Super Slow', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(255, 255, 255, 0)']},
    labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }],
    title: '<b>'Belly Button Wash Frequency'</b>',
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
}
