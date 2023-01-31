console.log(process.argv);
if (process.argv.length>2)
  runmode = 'JSON';
else
  runmode = 'HTML';

const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const client = require('./client');

//database connection
const connectDB = require('./config/database');
connectDB();

const user_model = require('./models/student');
const log_model = require('./models/log');

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(urlencodedParser);
// parse application/json
app.use(express.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// log 
async function my_log(req, res, next) {
  try { 
    console.log(global.runmode);
    const log_obj = new log_model({
      method: req.method,
      path: req.path,
      runmode: global.runmode
    });
    console.log(log_obj);
    await log_obj.save();
    console.log('log saved');
    next();
  } catch (e) {
    console.log(e);
    res.send('FAILED');
  }
};
app.use('/', my_log);

// Home Route
app.get('/', async function (req, res)  {
  var filter = { $expr: { $and: [] } };
  try {
    let params = (new URL(`http://${req.headers.host}${req.url}`)).searchParams;
    let toar = params.get('toar');
    let city = params.get('city');
    let avg = params.get('avg');
    const query = { toar: toar, city: city, grade: { $avg: avg } };

    if (toar && toar.trim() != '') {
      filter['$expr']["$and"].push({ "$eq": ["$toar", toar] })
    }
    if (city && city.trim() != '') {
      filter['$expr']["$and"].push({ "$eq": ["$city", city] })
    }
    if (avg && avg.trim() != '') {
      avg_num = avg * 1;
      filter['$expr']["$and"].push({
        "$gte": [{ "$avg": "$courses.grade" },
          avg_num]
      })
    }
    if (query == { toar: '', city: '', avg: '' }) {
      students = await user_model.find().exec();
    }
    else {
      students = await user_model.find(filter).exec();
      filter = { $expr: { $and: [] } };
    }
    if (runmode == 'HTML') {
    res.render('index', {
      title: 'Students',
      students: students
    });
  }
  else {
    students = await user_model.find(req.query).exec();
    res.send(students)
  }
  } catch (e) {
    res.send('FAILED');
  }
});

// Route Files
let students = require('./routes/students');
app.use('/students', students);

// Start Server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});
