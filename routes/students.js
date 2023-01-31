const express = require('express');
const router = express.Router();
const user_model = require('../models/student');

// Add Route
router.get('/add', async (req, res) => {
  res.render('add_student', {
    title: 'Add Student'
  });
});

// Add Submit POST Route
router.post('/add', async (req, res) => {
  try {
    const user = new user_model(req.body);
    const error = user.validateSync();
    await user.save();
    if (runmode == 'HTML') {
      res.render('add_student', {
        student: user,
        msg: 'student added successfully'
      })
      //res.redirect('/');
    }
    if (runmode == 'JSON') {
      res.send(user);
    }
  } catch (e) {
    console.log(e);
    res.send('FAILED');
  }
});

// Load Edit Form
router.get('/update/:id', async (req, res) => {
  try {
    const student = await user_model.findById(req.params.id);
    res.render('edit_student', {
      title: 'Edit Student',
      students: student,
    });
  } catch (e) {
    res.send(e);
  }
});

// Update Submit POST Route
router.post('/update/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let student = req.body;
    let query = { _id: req.params.id }

    if (runmode == 'JSON') {
      console.log(req.body);
      const update = await user_model.updateOne(query, req.body.update, { runValidators: true });
      if (update) {
        const student = await user_model.findById(req.params.id);
        res.send(student);
      }
    }
    if (runmode == 'HTML') {
      const update = await user_model.updateOne(query, student, { runValidators: true });
      if (update) {
        const student = await user_model.findById(req.params.id);
        res.render('edit_student', {
          title: 'Edit Student',
          students: student,
          msg: 'student updated successfully'
        })
        //res.redirect(req.baseUrl + '/update/' + req.params.id);
      }
    }
  } catch (e) {
    console.log(e);
    res.send('FAILED');
  }
});

router.post('/update/:id/addcourse/', async function run(req, res) {
  let id = req.params.id;
  let course = req.body;
  try {
    if (runmode == 'JSON') {
      console.log(req.body);
      const student = await user_model.findById(req.params.id);
      result = await user_model.updateOne(
        { _id: id },
        { $push: { courses: [req.body.courses] } },
        { runValidators: true })
    }
    if (runmode == 'HTML') {
      console.log(course);
      const student = await user_model.findById(req.params.id);
      result = await user_model.updateOne(
        { _id: id },
        { $push: { courses: [req.body] } },
        { runValidators: true })
      res.render('edit_student', {
        students: student,
        courses: course,
        msg: 'course added successfully'
      });
      //res.redirect(req.baseUrl + '/update/' + req.params.id);
    }
  } catch (e) {
    console.log(e);
    res.send('FAILED');
  }
});

// Delete Student
router.delete('/:id', async (req, res) => {
  try {
    let query = { _id: req.params.id }
    const student = await user_model.findById(req.params.id);
    remove = await user_model.findByIdAndRemove(query);
    if (remove) {
      res.send('Removed Successfully');
    }
  } catch (e) {
    console.log(e);
    res.send(0);
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    if (runmode == 'JSON') {
      //console.log(req.params.id);
      query = { _id: req.params.id }
      const student = await user_model.findById(req.params.id);
      remove = await user_model.findByIdAndRemove(query);
      if (remove) {
        res.send('Removed Successfully');
      }
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(0);
  }
});

router.post('/deleteall', async function (req, res) {
  try {
    remove = await user_model.deleteMany({});
    if (remove) {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
    res.send('FAILED');
  }
});

// Get Single Student
router.get('/:id', async (req, res) => {
  let id = req.params.id;
  const student = await user_model.findById(req.params.id);
  if (student) {
    res.render('student', {
      students: student,
      courses: student.courses,
    });
  }
});

module.exports = router;
