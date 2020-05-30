//function to set up metadata
function buildMeta(sample){

    d3.json("samples.json").then((data)=>{
      var metadata =  data.metadata;
      var filteredMetadatum = metadata.filter(sampleObject => sampleObject.id == sample);
      var filteredMetadata = filteredMetadatum[0];
      var dropdownMenu = d3.select("#sample-metadata");
      //clearing the dropdown menu
      dropdownMenu.html("");
      //looping through results and putting uppercase key value in dropdown
     Object.entries(filteredMetadata)
            .forEach(([key, value]) => { dropdownMenu
            .append("h5")
            .text(`${key.toUpperCase()}: ${value}`);   
             });
    
    });
  }
  //barchart within buildchart
  function buildChart(sample){
  
    d3.json("samples.json").then((data)=>{
      var samplesData =  data.samples;
      var filteredSamples = samplesData.filter(sampleObject => sampleObject.id == sample);
      var filteredSample = filteredSamples[0];
      var sample_values  = filteredSample.sample_values;
      var otu_ids  = filteredSample.otu_ids;
      var otu_labels   = filteredSample.otu_labels;
          //needs to be an object
      var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
      var barLayout = {
        title: "Top 10 OTUs" 
      };
  
      Plotly.newPlot("bar",barData,barLayout);
    
  
   // create the trace for the bubble chart
    var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids,
    },
    text: "Otu Labels"
  
  }];
  
  // set the layout for the bubble plot
  var bubbleLayout = {
    xaxis:{title: "Otu ID"},
    height: 500,
    width: 1000
  };
    
  // create the bubble plot
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
  });
}

function optionChanged(newSample){ 
  buildchart(newSample);
  buildmetada(newSample);
    
  }
  function gaugeChart(data) {

    console.log("gaugeChart", data);
  
    if(data.wfreq === null){
      data.wfreq = 0;
    }
  
    let degree = parseInt(data.wfreq) * (180/10);
  
    // Trig to calc meter point
    let degrees = 180 - degree;
    let radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);
  
    let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    let path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    let trace = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 50, color:'2F6497'},
        showlegend: false,
        name: 'WASH FREQ',
        text: data.wfreq,
        hoverinfo: 'text+name'},
      { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
      textinfo: 'text',
      textposition:'inside',
      textfont:{
        size : 16,
        },
      marker: {colors:[...arrColorsG]},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
      hoverinfo: 'text',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
  
    let layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '#2F6497',
          line: {
            color: '#2F6497'
          }
        }],
  
      title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
      height: 550,
      width: 550,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
    };
  
    Plotly.newPlot('gauge', trace, layout, {responsive: true});
  }

  // init function
  function init(){
    var selection = d3.select("#selDataset");
  //  loop through sample.json
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample)=>{selection
      .append("option")
      .text(sample)
      .property("value",sample);
      });

      buildMeta(sampleNames[0]);
      buildChart(sampleNames[0]);
    });
  }
      
  init();