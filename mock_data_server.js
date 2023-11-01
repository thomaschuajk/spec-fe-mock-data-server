const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const port = 3000;

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

// Curve plot data
const curvePlotData = [
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 },
    { x: 5, y: 10 },
];
const start = 0;
const stop = 99;
const step = 1;

const array_length = (stop-start)/step+1;

const arrayRange = Array.from(
    {length: array_length},
    (value,key) => start+key*step
);

let thresholdarray = arrayRange;;
let far_array = Array(array_length).fill().map(()=>Math.random());
// console.log(far_array);
let frr_array = Array(array_length).fill().map(()=>Math.random());
// console.log(frr_array);
const mock_data = {
        quality_boxplot: quality_boxPlotData,

        far_frr: {
            labels: "FAR-FRR",
            thresholds: thresholdarray,
            far: far_array,
            frr: frr_array
        }

        // histogram: {
        //     bins: [0,10,20,30,...,10000]
        //     mated: [0,0,0,..],
        //     nonmated: [...,0,0,0]
        // }

        // EER: yyy
};

//Stats data endpoint
app.get('/', (req,res)=>{
    res.json(mock_data)
})

// Box plot endpoint
app.get('/quality_boxplot', (req, res) => {
    res.json(quality_boxPlotData);
});

// Curve plot endpoint
app.get('/far_frr', (req, res) => {
    res.json(curvePlotData);
});

// Start server
app.listen(port, () => {
    console.log('Server started on port 3000');
});
