require('dotenv').config();
const express = require('express');
const neo4j = require('neo4j-driver');
const apiRouter = require('./routes/apiRoutes');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(express.static('public'));

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

app.use((req, res, next) => {
    req.neo4jDriver = driver;
    next();
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
