// Build the metadata panel  https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMeta = metadata.filter(item => item.id ==sample);

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html ("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    filteredMeta.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
      panel.append("p").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSamples[0].otu_ids;
    let otu_labels = filteredSamples[0].otu_labels;
    let sample_values = filteredSamples[0].sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
      }
    }]

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Number of Bacteria'},
      hovermode: 'closest'
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
  
    let barData = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }]

    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: { title: 'Number of Bacteria'},
    }

    // Render the Bar Chart

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    let first_Sample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first_Sample);
    buildMetadata(first_Sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
