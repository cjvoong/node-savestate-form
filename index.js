// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('frontend'));

// Endpoint to handle form submission
app.post('/submitForm', (req, res) => {
    const formDataArray = req.body;

    // Save form data to the database
    const values = formDataArray.map(formData => [formData.name, formData.email]);

    db.query('INSERT INTO forms (name, email) VALUES ?', [values], (error, results) => {
        if (error) {
            console.error('Error inserting data into the database:', error);
            res.status(500).send('Error submitting the form');
        } else {
            console.log('Form data submitted to the database:', results);
            res.send('Form submitted successfully!');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
