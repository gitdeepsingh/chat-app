const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3010;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

app.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});