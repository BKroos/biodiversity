function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata2 = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj2 => sampleObj2.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata2.filter(sampleObj3 => sampleObj3.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var match = sampleArray[0];
    // 2. Create a variable that holds the first sample in the metadata array
    var metaMatch = metadataArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var id = match.otu_ids;
    var labels = match.otu_labels;
    var sliceLabels = match.otu_labels.slice(0,10).reverse();
    var values = match.sample_values;
    var sliceValues = match.sample_values.slice(0,10).reverse();
    // 3. Create a variable that holds the washing frequency.
    var wfreq = metaMatch.wfreq;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var sortedSamples = id.sort((a,b) => a.id - b.id).reverse();
    // var topTenSamples = sortedSamples.slice(0,10);
    var yticks = id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // console.log(topTenSamples);
    // }) 

    // // 8. Create the trace for the bar chart. 
    var barData = {
      x: sliceValues,
      y: yticks,
      text: sliceLabels,
      type: 'bar',
      orientation: 'h'
    };
    // // // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria in your Belly-Button",
     xaxis: {title:'Amount of Bacteria'},
     yaxis: {title:'Type of Bacteria'}

    };
    // // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', [barData], barLayout);
 
    // 1. Create the trace for the bubble chart.
    //var xticks = id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var bubbleData = {
      x: id,
      y: values,
      text: labels,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: values,
        color: id,
        colorscale: [[0, '#4b4ba9'], [.2, '#54d2b0'],[.2, '#7fe36b'],[.5, '#c0ea6e'],[.5, '#99752b'],[1, '#d7c7b9']] 
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Top Bacteria in your Belly-Button',
      showlegend: false,
      xaxis: {title: 'OTU IDs'},
      margin: {
        l: 40,
        r: 40,
        b: 60,
        t: 60
      }
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
      domain: {x: [0,1], y: [0,1]},
      value: wfreq,
      title: {text: 'Belly-Button Washing Frequency'},
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [0, 10]},
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "maroon" },
          { range: [2, 4], color: "red" },
          { range: [4, 6], color: "olive" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ],
        threshold: {
          line: { color: "black", width: 2 },
          thickness: 0.75,
          value: 6
        }
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 400,
     height: 300
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}