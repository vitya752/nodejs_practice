const {Router} = require('express');
const Course = require('./../models/course');

const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.getCourse(req.params.id);
    res.render('course', {
        title: course.title,
        isCourses: true,
        course
    })
});

router.get('/:id/edit', async (req, res) => {
    const course = await Course.getCourse(req.params.id);
    if(!req.query.allow) return res.redirect('/');
    res.render('edit', {
        title: `Редактировать курс ${course.title}`,
        isCourses: true,
        course
    })
});

router.post('/edit', async (req, res) => {
    await Course.updateCourse(req.body);
    res.redirect('/courses');
});

module.exports = router;