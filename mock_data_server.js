const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const port = 3000;


/**
 *  Logic generate mock far frr data 
 *  */
// const start = 0;
// const stop = 99;
// const step = 1;

// const array_length = (stop-start)/step+1;

// const arrayRange = Array.from(
//     {length: array_length},
//     (value,key) => start+key*step
// );

// let thresholdarray = arrayRange;;
// let far_array = Array(array_length).fill().map(()=>Math.random());
// // console.log(far_array);
// let frr_array = Array(array_length).fill().map(()=>Math.random());
// // console.log(frr_array);

/**
 * Logic to reformat far frr data from csv file
 */

// Box plot data
const quality_boxPlotData = {
    labels: ["Quality"],
    mean: 0.919916301,
    median: 0.9362550000000001,
    Q1: 0.89880775,
    Q3: 0.954976,
    IQR: 0,
    top: 0.983662,
    bottom: 0.719196
};


//Capture histogram data from csv files
let scores_array = new Array();
let matedcounts_array = new Array();
let nonmatedcounts_array = new Array();

function PushToCountsArrays(line,col_type){

    switch(col_type){
        case 'scores':
            scores_array.push(parseInt(line[0],10));
            break;
        case 'mated':
            matedcounts_array.push(parseInt(line[1],10));
            break;
        case 'nonmated':
            nonmatedcounts_array.push(parseInt(line[1],10));
            break;
        default:
            console.error(`Error: ${line}`)
    }
}

function ReadData(filepath,col_type){
    fs.readFile(filepath, 'utf8', (err, data) => {
        if(err) {
            console.log('Error reading the file:', err);
            return;
        }
        const lines = data.split('\n');
        for (let i = 1; i < lines.length-1; i++) {
            //console.log(lines[i]);
            const line = lines[i].trim().split(',');
            if(line.length===2) {
                PushToCountsArrays(line,col_type);
            } else {
                console.error(`Error: ${line}`)
            }
                
        }
    });
   
}

ReadData('score_counts_true_total.csv','scores');
ReadData('score_counts_true_total.csv','mated');
ReadData('score_counts_false_total.csv','nonmated');

//Histogram data
const histogram_data = {
    scores: scores_array,
    mated: matedcounts_array,
    nonmated: nonmatedcounts_array
};

//FAR-FRR data
const far_frr_data = {
    labels: "FAR-FRR",
    thresholds: scores_array,
    far: matedcounts_array,
    frr: nonmatedcounts_array
};

const mock_data = {
        quality_boxplot: quality_boxPlotData,

        far_frr: far_frr_data,

        histogram: {
            scores: scores_array,
            mated: matedcounts_array,
            nonmated: nonmatedcounts_array
        }

        // EER: yyy
};

//Stats data endpoint
// app.get('/', (req,res)=>{
//     res.json(mock_data)
// })

// Box plot endpoint
app.get('/quality_boxplot', (req, res) => {
    res.json(quality_boxPlotData);
});

// Curve plot endpoint
app.get('/far_frr', (req, res) => {
    res.json(far_frr_data);
});

app.get('/histogram', (req, res) => {
    res.json(histogram_data);
});

// Start server
app.listen(port, () => {
    console.log('Server started on port 3000');
});
