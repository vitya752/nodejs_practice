const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const homeRoute = require('./routes/home');
const coursesRoute = require('./routes/courses');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine); //регистрируем в express, что есть такой движок
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e011f1e5166831950d4071a');
        req.user = user; //мы перехватываем запрос, и пихаем в запрос нашего юзера
        //next'ом пускаем выполнение скрипта дальше, иначе скрипт бы остановился
        next();
    } catch(e) {
        console.log(e);
    }
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoute);
app.use('/courses', coursesRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute)

const password = 'znDkBZL6eZvMQ5cn';

const PORT = process.env.PORT || 3000;

async function start() {

    try {
        const url = 'mongodb+srv://vitya:znDkBZL6eZvMQ5cn@cluster0-u4sqp.mongodb.net/shop';
        //shop - название поля, в котором будут наши данные
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        });
    
        const candidate = await User.findOne();
        if(!candidate) {
            const user = new User({
                email: 'vitya@mail.ru',
                name: 'Vitya',
                cart: {
                    items: []
                }
            });

            user.save();

        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
        
    } catch(e) {
        console.log(e);
    }

}

start();
