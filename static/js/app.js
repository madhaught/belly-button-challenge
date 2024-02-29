// use D3 library to read in samples.json from url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create horizontal bar chart with dropdown menu to display top 10 OTUs found in individual and a bubble chart that displays for each sample
function maddieCharts(individual) {
    d3.json(url).then(function (data) {
        let samples = data.samples;
        let results = samples.filter(x=>x.id==individual)[0];
        let otu_ids = results.otu_ids;
        let sample_values = results.sample_values;
        let otu_labels = results.otu_labels;

        let bubbleChart = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        let input = [bubbleChart];
        let layout = {
            title: 'Samples Found in Individual',
            xaxis:{
                title: 'OTU IDs'
            },
            yaxis: {
                title: 'Sample Values'
            }
        };

        Plotly.newPlot("bubble", input, layout);

        let barChart = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(x=>`OTU ${x}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let barInput = [barChart];
        let barLayout = {
            title: 'Top 10 OTUS Found in Individual',
            xaxis: {
                title: 'Sample Values'
            },
            yaxis: {
                title: 'OTU IDs'
            }
        };

        Plotly.newPlot("bar", barInput, barLayout);

    });
}

// Display sample metadata
function maddiePanel(person) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        let results = metadata.filter(x=>x.id==person)[0];
        let PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        for (k in results) {
            PANEL.append("h6").text(`${k.toUpperCase()}: ${results[k]}`);
        }
    });
}

// Update all the plots when a new sample is selected
function optionChanged(userInput) {
    maddieCharts(userInput);
    maddiePanel(userInput);
}

// Initialize functions for each selection
function init() {
    d3.json(url).then(function (data) {
        let names = data.names;
        let dropdown = d3.select("#selDataset");
        for (let i = 0; i < names.length; i++) {
            dropdown.append("option").text(names[i]).property("value", names[i]);
        }
        maddieCharts(names[0]);
        maddiePanel(names[0]);
    });
}

init();