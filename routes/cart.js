const Course = require('./../models/course');
const path = require('path');
const {Router} = require('express');

const router = Router();

const mapCartItems = (cart) => {
    return cart.items.map((item) => {
        return {
            ...item.courseId._doc,
            id: item.courseId._id,
            count: item.count
        }
    })
};

const computePrice = (courses) => {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id); //удаляем нужный нам id, и сохраняем результат в этой функции
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();//и результат уже возьмем из user`а

    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: computePrice(courses)
    }

    res.json(cart);
});


router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    
    const courses = mapCartItems(user.cart);

    res.render('cart', {
        isCart: true,
        title: 'Корзина',
        courses: courses,
        price: computePrice(courses)
    })
})

module.exports = router;