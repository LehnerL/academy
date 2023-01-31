// Please uncomment line 88 "run()", for creating some new students 

console.log(__dirname);
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/academy';

const take_course_schema = new mongoose.Schema({
    cid: {
        type: String,
        required: [true, 'cid is missing'],
         validate: {
            validator: function (v) {
                return (v.length == 5 && v.trim() != '')
            }
        }
    },
    grade: {
        type: Number,
        required: [true, 'grade is missing'],
         validate: {
            validator: function (v) {
                return (v >= 0 && v <= 100)
            }
        }
    }
});

const stu_schema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'id is missing'],
        validate: {
            validator: function (v) {
                return (v.length == 9 && v.trim() != '')
            }
        }
    },
    name: {
        type: String,
        required: [true, 'name is missing']
    },
    toar: {
        type: String,
        enum: {
            values: ['BA', 'MA', 'PHD'],
            message: '{VALUE} is not valid!'
        },
        required: [true, 'toar is required']
    },
    city: {
        type: String,
        validate: {
            validator: function (v) {
                return (v.length >= 1 && v.trim() != '')
            }
        }
    },
    courses:[take_course_schema]
}, { collection: 'students' }
);

const student_model = conn1.model('', stu_schema);

// Create students data
const students_data = [];
let edu_v;
for (let i = 0; i < 7; i++) {
    if (i % 2 == 0)
        edu_v = "BA";
    else
        edu_v = "MA";
    students_data.push({ id: '00000000' + (i + 1), name: 'Stu' + (i + 1), toar: edu_v, city: 'TLV', courses: [{ cid: '00005', grade: 90 }] })
}

async function run() {
    try {
        await mongoose.connect(uri);
        const results = await student_model.insertMany(students_data);
        console.log('Successfully stored students');
    } catch (err) {
        console.log(err);
    }
    finally {
        mongoose.connection.close();
        console.log("Connection closed");
    }
}
//run();

module.exports = student_model;
