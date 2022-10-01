

// Initialize the Dashboard
function initializeDB() 
{
    // Puts all the data in the console log
    let data = d3.json('samples.json');
    // console.log(data);

    // Build the drop down menu with the selDataset ID by feeding in names from samples.json
    let selectData = d3.select('#selDataset');

    // Grab the names data. This gets rid of the other data types in the samples.json file.
    d3.json('samples.json').then((data) => {
        let sampleNames = data.names
        // console.log(sampleNames);

        // Use foreach to create options for each sample name
        sampleNames.forEach((sampleID) => {
            selectData.append('option').text(sampleID).property('value', sampleID); // replaces value with sampleID
        });

        // Pass information for the first sampleID
        let firstSampleID = sampleNames[0];

        // Builds the metadata
        demographicInfo(firstSampleID);

        // Call the function to build the chart chart
        buildBarChart(firstSampleID);

        // Call the function to build the bubble chart
        buildBubbleChart(firstSampleID);
    });

}

initializeDB();

// Update the Dashboard
// Logs the updated selections to the console
function optionChanged(item)
{
    // console.log(item);
    // Call the metadata update
    demographicInfo(item);

    // Call the function to build the bar chart
    buildBarChart(item);

    // Call the function to build the bubble chart
    buildBubbleChart(item);
}


// Populate the Metadata
function demographicInfo(sampleID)
{
    console.log(sampleID);

    d3.json('samples.json').then((data) => {

        // grabs the metadata
        let metaData = data.metadata;
        // console.log(metaData);

        // filter based on the value of the sampleID, returns array
        let resultID = metaData.filter(sampleIDResult => sampleIDResult.id == sampleID);
        // console.log(resultID);

        // get just index 0 from the array, returns object
        let resultData = resultID[0];
        // console.log(resultData);

        // Clear the existing data out before repopulating the table
        d3.select('#sample-metadata').html('');

        // extract the value-key pairs to the chart
        Object.entries(resultData).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('h5').text(`${key}: ${value}`)
        });

    });
}


// Build the Graphs here
function buildBarChart(sampleID)
{
    // console.log(sampleID);
    // let data = d3.json('samples.json');
    // console.log(data);

    d3.json('samples.json').then((data) => {

        // grabs the sample data
        let sampleData = data.samples;
        // console.log(sampleData);

        // filter based on the value of the sampleID, returns array
        let resultID = sampleData.filter(sampleIDResult => sampleIDResult.id == sampleID);
        // console.log(resultID);

        // get just index 0 from the array, returns object
        let resultData = resultID[0];
        // console.log(resultData);

        // Get the otu_ids, labels, and sample_values values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        // console.log(otu_ids);
        // console.log(otu_labels);
        // console.log(sample_values);

        // Build out the bar chart
        let yTicks = otu_ids.slice(0, 10).map(id => `otu ${id}`);
        // console.log(yTicks);
        let xValues = sample_values.slice(0, 10);
        // console.log(xValues);
        let textLabels = otu_labels.slice(0, 10);
        // console.log(textLabels);

        let barChart = {
            y: yTicks.reverse(), // Need it to most to least top to bottom
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: 'bar',
            orientation: 'h'
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot('bar', [barChart], layout);
    });
}

// Function to build the Bubble chart
function buildBubbleChart(sampleID)
{
    // console.log(sampleID);
    // let data = d3.json('samples.json');
    // console.log(data);

    d3.json('samples.json').then((data) => {

        // grabs the sample data
        let sampleData = data.samples;
        // console.log(sampleData);

        // filter based on the value of the sampleID, returns array
        let resultID = sampleData.filter(sampleIDResult => sampleIDResult.id == sampleID);
        // console.log(resultID);

        // get just index 0 from the array, returns object
        let resultData = resultID[0];
        // console.log(resultData);

        // Get the otu_ids, labels, and sample_values values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        // console.log(otu_ids);
        // console.log(otu_labels);
        // console.log(sample_values);

        // Build out the bubble chart
        let bubbleChart = {
            y: sample_values, 
            x: otu_ids,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bubble', [bubbleChart], layout);
    });
}