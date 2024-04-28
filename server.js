const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let pills = {};
let servedTimeRanges = {};

const timeRangeMap = {
    'morning': '5AM-10AM',
    'noon': '10AM-12PM',
    'afternoon': '12PM-4PM',
    'evening': '4PM-8PM',
    'night': '8PM-5AM'
};

function getCurrentTimeRange() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 12) return 'noon';
    if (hour >= 12 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
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
    const date = getCurrentDate();
    const timeRange = req.query.timeRange || getCurrentTimeRange();

    if (servedTimeRanges[date] && servedTimeRanges[date][timeRange]) {
        return res.status(404).json({ error: "This time range has already been served today." });
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

app.get('/markServed', (req, res) => {
    const date = getCurrentDate();
    const timeRange = req.query.timeRange || getCurrentTimeRange();

    if (!timeRangeMap[timeRange]) {
        return res.status(400).json({ error: "Invalid time range specified" });
    }

    if (!servedTimeRanges[date]) {
        servedTimeRanges[date] = {};
    }

    servedTimeRanges[date][timeRange] = true;
    res.json({ message: `Marked ${timeRange} of ${date} as served.` });
});

app.get('/unMarkServed', (req, res) => {
    const date = getCurrentDate();
    const timeRange = req.query.timeRange || getCurrentTimeRange();

    if (!timeRangeMap[timeRange]) {
        return res.status(400).json({ error: "Invalid time range specified" });
    }

    if (servedTimeRanges[date] && servedTimeRanges[date][timeRange]) {
        delete servedTimeRanges[date][timeRange];
        res.json({ message: `Mark for ${timeRange} on ${date} has been removed.` });
    } else {
        res.status(404).json({ error: `No mark found for ${timeRange} on ${date}.` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
