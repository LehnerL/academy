console.log(__dirname);
const mongoose = require('mongoose');

const log_schema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        default: Date.now(),
        required: true
    },
    path: {
        type: String,
        required: true
    },
    runmode: {
        type: String,
        required: true
    }
}, { collection: 'log' }
);

const logfile_model = conn2.model('', log_schema);
module.exports = logfile_model;
