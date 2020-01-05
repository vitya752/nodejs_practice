const {Router} = require('express');
const Course = require('./../models/course');
const auth = require('./../middleware/auth');
const {validationResult} = require('express-validator');
const {courseValidators} = require('./../utils/validators');

const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true,
        error: req.flash('error')
    });
});

router.post('/', auth, courseValidators, async (req, res) => {
    const { title, price, img } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(422).render('add', {
            title: 'Добавить курс',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        });
    }

    const course = new Course({
        title,
        price,
        img,
        userId: req.user._id
    });

    try {
        await course.save();
    } catch(e) {
        console.log(e);
    }

    res.redirect('/courses');
});

module.exports = router;