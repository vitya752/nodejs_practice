const {Router} = require('express');
const Course = require('./../models/course');
const auth = require('./../middleware/auth');

const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    });
});

router.post('/', auth, async (req, res) => {
    const { title, price, img } = req.body;
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