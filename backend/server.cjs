const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    console.log("Handshake received! React just called the backend.");
    res.json({
        message: "The Brain is active",
        status: "success",
        location: "Jamshedpur"
    });
});

app.post('/calculate', (req, res) => {

    const { anchors } = req.body;

    console.log("Received anchors for calculation:", anchors);

    if (anchors.length < 3) {
        return res.json({ error: "Need at least 3 anchors to calculate!" });
    }


    const avgX = (anchors[0].x + anchors[1].x + anchors[2].x) / 3;
    const avgY = (anchors[0].y + anchors[1].y + anchors[2].y) / 3;


    res.json({
        x: avgX,
        y: avgY,
        message: "Position calculated successfully!"
    });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});