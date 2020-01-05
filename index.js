const express = require('express');//создание сервера и роуты
const exphbs = require('express-handlebars');//шаблонизатор html
const mongoose = require('mongoose');//для связи с базой mongodb
const session = require('express-session');//для внедрения сессий
const MongoStore = require('connect-mongodb-session')(session);//сессии с mongodb
const csrf = require('csurf');//валидация форм, чтобы не подделать форму
const flash = require('connect-flash');//для вывода ошибок
const helmet = require('helmet');//меняет заголовки с сервера для безопасности
const compression = require('compression');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const keys = require('./keys');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const path = require('path');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine); //регистрируем в express, что есть такой движок
app.set('view engine', 'hbs');//
app.set('views', 'views');//регистрируем папку views, как папка с шаблонами

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {

    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
        
    } catch(e) {
        console.log(e);
    }

}

start();
