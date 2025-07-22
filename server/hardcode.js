const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected successfully");
        const model = require('./models/user.model');

        return model.insertMany([
            { id: 'admin', password: 'admin', role: 'admin' },
            { id: 'principal', password: 'principal', role: 'principal' },
        ]);
    })
    .then(() => {
        console.log("Data inserted successfully");
        mongoose.disconnect(); // Disconnect after insertion
    })
    .catch((err) => {
        console.error(err);
        mongoose.disconnect(); // Also disconnect on error
    });