const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let pills = {}; // Store pills by box number with details including name and schedule

// Add a pill
app.post('/addPill', (req, res) => {
    const { name, boxNumber } = req.body;
    if (pills[boxNumber]) {
        return res.status(400).json({ error: "Box number is already taken" });
    }
    pills[boxNumber] = { name, boxNumber, schedule: [] };
    res.status(201).json(pills[boxNumber]);
});

// Delete a pill
app.delete('/deletePill/:boxNumber', (req, res) => {
    const boxNumber = req.params.boxNumber;
    if (!pills[boxNumber]) {
        return res.status(404).json({ error: "Pill not found for this box number" });
    }
    delete pills[boxNumber];
    res.status(204).send();
});

// Get all pills
app.get('/pills', (req, res) => {
    res.status(200).json(Object.values(pills));
});

// Update pill schedule
app.post('/updateSchedule', (req, res) => {
    const { boxNumber, schedule } = req.body;
    if (!pills[boxNumber]) {
        return res.status(404).json({ error: "Pill not found for this box number" });
    }
    pills[boxNumber].schedule = schedule;
    res.status(200).json({ message: "Schedule updated successfully", pill: pills[boxNumber] });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
