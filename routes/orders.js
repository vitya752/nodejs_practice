const {Router} = require('express');
const Order = require('./../models/order');
const auth = require('./../middleware/auth');

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const defaultOrder = await Order.find({'user.userId': req.user._id});

        const order = await defaultOrder.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    total += c.course.price * c.count;
                    return total;
                }, 0)
            }
        })
        
        res.render('orders', {
            isOrders: true,
            title: 'Мои заказы',
            order
        })
    } catch(e) {
        console.log(e);
    }
});

router.post('/', auth, async (req, res) => {

    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate();

        const courses = await user.cart.items.map(item => {
            return {
                count: item.count,
                course: {...item.courseId._doc}
            }
        });
    
        const order = new Order({
            courses, 
            user: {
                name: req.user.name,
                email: req.user.email,
                userId: req.user._id
            }
        });
    
        await order.save();
        await req.user.clearCart();
    
        res.redirect('/orders');
    } catch(e) {
        console.log(e);
    }

});

module.exports = router;