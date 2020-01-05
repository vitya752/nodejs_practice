const {Router} = require('express');
const Course = require('./../models/course');
const auth = require('./../middleware/auth');

const router = Router();

const myCourse = (course, req) => {
    if(course.userId.toString() !== req.user._id.toString()) {
        return false;
    } else return true;
}

router.get('/', async (req, res) => {
    const courses = await Course.find().populate('userId', 'name');
    //populate позволяет обратится к коллекции users по id
    //благодаря свойству ref в моделях
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses: courses.map(item => {
                    if(req.user) {
                        if(item.userId._id.toString() === req.user._id.toString()) {
                            return {
                                ...item._doc,
                                id: item._id,
                                canEdit: true
                            };
                        } else return item;
                    } else return item;
                })
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

router.get('/:id/edit', auth, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!myCourse(course, req)) {
        return res.redirect('/');
    }
    if(!req.query.allow) return res.redirect('/');
    res.render('edit', {
        title: `Редактировать курс ${course.title}`,
        isCourses: true,
        course
    })
});

router.post('/edit', auth, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!myCourse(course, req)) {
        return res.redirect('/');
    }
    const {id} = req.body.id;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);//принимает id, а вторым параметром - объект свойств, которые надо обновить
    //удаляем id из объекта, чтобы не занести его в базу
    res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    if(!myCourse(course, req)) {
        return res.redirect('/');
    }
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