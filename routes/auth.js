const {Router} = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error')
    })
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
    
        if(user) {
            const areSame = await bcrypt.compare(password, user.password);
            if(areSame) {
                req.session.user = user;
            
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('error', "Авторизация: Неправильный пароль");
                res.redirect('/auth/login');
            }
        } else {
            req.flash('error', "Авторизация: Такого пользователя не существует");
            res.redirect('/auth/login')
        }
    } catch(e) {
        console.log(e);
    }
});

router.post('/register', async (req, res) => {
    try {
        const {rlogin, remail, rpassword, rpassword2} = req.body;
        const candidate = await User.findOne({ remail });

        if(candidate) {
            req.flash('error', "Регистрация: Такой email уже зарегистрирован у нас на сайте");
            res.redirect('/auth/login');
        } else {
            if(rpassword === rpassword2) {
                const hashPass = await bcrypt.hash(rpassword, 10);
                const user = await new User({
                    name: rlogin,
                    password: hashPass,
                    email: remail,
                    cart: {items: []}
                });
                await user.save();
                res.redirect('/auth/login');
            } else {
                req.flash('error', "Регистрация: Пароли не совпали.");
                res.redirect('/auth/login');
            }
        }
    } catch(e) {

    }
});

module.exports = router;