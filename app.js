const mongoose = require('mongoose');
const express = require('express');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', require('./routes/auths.routes.js'));
app.use('/sub', require('./routes/subscribes.routes.js'));

const PORT = 3000;

async function start() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myProject', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));

        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}`);
        });
    } catch(e) {
        console.log('Server error', e.message);
        process.exit();
    }
};

start();