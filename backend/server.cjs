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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});