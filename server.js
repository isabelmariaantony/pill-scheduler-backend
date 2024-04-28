const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let pills = {};

const timeRangeMap = {
    'morning': '6AM-10AM',
    'noon': '10AM-12PM',
    'afternoon': '12PM-4PM',
    'evening': '4PM-8PM',
    'night': '8PM-6AM'
};

function getCurrentTimeRange() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';   // From 6 AM to 10 AM
    if (hour >= 10 && hour < 12) return 'noon';     // From 10 AM to 12 PM
    if (hour >= 12 && hour < 16) return 'afternoon';// From 12 PM to 4 PM
    if (hour >= 16 && hour < 20) return 'evening';  // From 4 PM to 8 PM
    return 'night';                                 // From 8 PM to 6 AM
}

app.post('/addPill', (req, res) => {
    const { name, boxNumber } = req.body;
    if (pills[boxNumber]) {
        return res.status(400).json({ error: "Box number is already taken" });
    }
    pills[boxNumber] = { name, boxNumber, schedule: [] };
    res.status(201).json(pills[boxNumber]);
});

app.delete('/deletePill/:boxNumber', (req, res) => {
    const boxNumber = req.params.boxNumber;
    if (!pills[boxNumber]) {
        return res.status(404).json({ error: "Pill not found for this box number" });
    }
    delete pills[boxNumber];
    res.status(204).send();
});

app.post('/updateSchedule', (req, res) => {
    const { boxNumber, schedule } = req.body;
    if (!pills[boxNumber]) {
        return res.status(404).json({ error: "Pill not found for this box number" });
    }
    pills[boxNumber].schedule = schedule;
    res.status(200).json({ message: "Schedule updated successfully", pill: pills[boxNumber] });
});

app.get('/pills', (req, res) => {
    res.status(200).json(Object.values(pills));
});

app.get('/pillsByTimeRange', (req, res) => {
    let { timeRange } = req.query;
    if (!timeRange) {
        timeRange = getCurrentTimeRange();
    }
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
