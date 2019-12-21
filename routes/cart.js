const Course = require('./../models/course');
const Cart = require('./../models/cart');
const path = require('path');
const {Router} = require('express');

const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.getCourse(req.body.id);
    const cart = await Cart.add(course);
    res.redirect('/cart');
});

router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id);
    res.json(cart);
});


router.get('/', async (req, res) => {
    const cart = await Cart.fetch();
    res.render('cart', {
        isCart: true,
        title: 'Корзина',
        courses: cart.courses,
        price: cart.price
    })
})

module.exports = router;