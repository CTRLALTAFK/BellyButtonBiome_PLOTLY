
//function to set up metadata
function buildMeta(sample){

  d3.json("/samples.json").then((data)=>{
    var metadata =  data.metadata;
    var filteredMetadatum = metadata.filter(sampleObject => sampleObject.id == sample);
    var filteredMetadata = filteredMetadatum[0];
    var dropdownMenu = d3.select("#sample-metadata");
   //clearing the dropdown menu
    dropdownMenu.html("");
   //looping through results and putting uppercase key value in dropdown
   Object.entries(filteredMetadata).forEach(([key, value]) => {
           dropdownMenu.append("h5").text(`${key.toUpperCase()}: ${value}`);   
           });
  
  });
}


//barchart within buildchart
function buildChart(sample){

  d3.json("/samples.json").then((data)=>{
    var samplesData =  data.samples;
    var filteredSamples = samplesData.filter(sampleObject => sampleObject.id == sample);
    var filteredSample = filteredSamples[0];
    var sample_values  = filteredSample.sample_values;
    var otu_ids  = filteredSample.otu_ids;
    var otu_labels   = filteredSample.otu_labels;

  });


  var trace ={
    x: sample_values.slice(0,10).reverse(),
    y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
    text: otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
  };
    var layout = {
      title: "Top 10 OTUs" 
    };

    Plotly.newPlot("bar",data,layout)
  }

 // create the trace for the bubble chart
 var bubleTrace = {
  x: otu_ids,
  y: sample_values,
  mode: "markers",
  marker: {
      size: sample_values,
      color: otu_id,
  },
  text: "Otu Labels"

};

// set the layout for the bubble plot
var layout = {
  xaxis:{title: "Otu ID"},
  height: 500,
  width: 1000
};


// create the bubble plot
Plotly.newPlot("bubble", data, layout); 



// init function
function init(){
  var selection = d3.select("#selDataset");
//  loop through sample.json
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample)=>{
    selection
    .append("option")
    .text(sample)
    .property("value",sample);
    });
    buildMeta(sampleNames[0]);
    buildChart(sampleNames[0]);
  });
}

function optionChanged(newSample){
  
  
  buildchart(newSample);
  buildmetada(newSample);


}



init()