function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  const metadataURL = "/metadata/" + sample;
  
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select('#sample-metadata')
    
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("")
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    async function getMeta() {
      let myMeta = await d3.json(metadataURL);
      let myMetaArray = Object.entries(myMeta);
      myMetaArray.forEach(([key, value]) => {
        metadataPanel.append("h6").html(`<strong>${key}</strong>  :  ${value}`)
      });
    }
    getMeta();

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function pieChart(data) {

  let labels = data.otu_ids.slice(0, 10);
  let values = data.sample_values.slice(0, 10)
  let hovertext = data.otu_labels.slice(0, 10)

  let trace = {
    values: values,
    labels: labels,
    type: "pie",
    textposition: "inside",
    hovertext: hovertext
  }

  let layout = {
    title: "<b>Belly Button Pie Chart</b>",
    plot_bgcolor: "white",
    paper_bgcolor: "white"
  }

  let pieData = [trace]
  Plotly.newPlot("pie", pieData, layout, {responsive: true});

}

function bubbleChart(data) {

  let 
    x = data.otu_ids,
    y = data.sample_values,
    markersize = data.sample_values,
    markercolors = data.otu_ids,
    textvalues = data.otu_labels;
  
  let trace = {
    x: x,
    y: y,
    mode: "markers",
    marker: {
      size: markersize,
      color: markercolors,
      colorscale: "Earth"
    },
    text: textvalues,
  }
  let bubbleData = [trace]

  let layout = {
    title: "<b>Belly Button Bubble Chart</b>",
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    },
    width: 1100,
    plot_bgcolor: "white",
    paper_bgcolor: "white"
  }

  Plotly.newPlot("bubble", bubbleData, layout, {responsive: true} )
}

function gaugeChart(data) {

  var level = data.WFREQ;

  // Trig to calc meter point
  var degrees = 180 - (level*20),
       radius = .7;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  
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
    { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
    rotation: 90,
    text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
              '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['#84B589','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                           '#F4F1E4','#F8F3EC', 'rgba(255, 255, 255, 0)',]},
    labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
    '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: true
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

    title: '<b>Belly Button Wash Frequency</b><br>Scrubs per Week',
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  Plotly.newPlot('gauge', data, layout);
}





async function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    const chartsURL = "/samples/" + sample;
    
    const metaURL = "/metadata/" + sample;
    
    const data = await d3.json(chartsURL);
    const metadata = await d3.json(metaURL);

    console.log(metadata);
    

    pieChart(data);
    bubbleChart(data);
    gaugeChart(metadata);
}




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
