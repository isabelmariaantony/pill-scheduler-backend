const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let pills = {}; // This will store pills by their box numbers, each with a name, schedule, and box number.

const timeRangeMap = {
    'morning': '5AM-10AM',
    'noon': '10AM-12PM',
    'afternoon': '12PM-4PM',
    'evening': '4PM-8PM',
    'night': '8PM-5AM'
};

// Add a new pill
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

// Update pill schedule
app.post('/updateSchedule', (req, res) => {
    const { boxNumber, schedule } = req.body;
    if (!pills[boxNumber]) {
        return res.status(404).json({ error: "Pill not found for this box number" });
    }
    pills[boxNumber].schedule = schedule;
    res.status(200).json({ message: "Schedule updated successfully", pill: pills[boxNumber] });
});

// Get all pills
app.get('/pills', (req, res) => {
    res.status(200).json(Object.values(pills));
});

// Get pills by time range
app.get('/pillsByTimeRange', (req, res) => {
    const { timeRange } = req.query;  // e.g., timeRange='morning'
    if (!timeRangeMap[timeRange]) {
        return res.status(400).json({ error: "Invalid time range specified" });
    }

    const mappedTimeRange = timeRangeMap[timeRange];
    const result = Object.values(pills).reduce((acc, pill) => {
        const scheduleEntry = pill.schedule.find(entry => entry.timeRange === mappedTimeRange);
        if (scheduleEntry) {
            acc.push({
                name: pill.name,
                boxNumber: pill.boxNumber,
                count: scheduleEntry.count
            });
        }
        return acc;
    }, []);

    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
