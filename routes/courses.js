const {Router} = require('express');
const Course = require('./../models/course');

const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find().populate('userId', 'name');
    //populate позволяет обратится к коллекции users по id
    //благодаря свойству ref в моделях
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        title: course.title,
        isCourses: true,
        course
    })
});

router.get('/:id/edit', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!req.query.allow) return res.redirect('/');
    res.render('edit', {
        title: `Редактировать курс ${course.title}`,
        isCourses: true,
        course
    })
});

router.post('/edit', async (req, res) => {
    const {id} = req.body.id;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);//принимает id, а вторым параметром - объект свойств, которые надо обновить
    //удаляем id из объекта, чтобы не занести его в базу
    res.redirect('/courses');
});

router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/courses');
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;