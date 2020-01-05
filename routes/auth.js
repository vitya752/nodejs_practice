const {Router} = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const nodemailer = require('nodemailer');
const sendinBlue = require('nodemailer-sendinblue-transport');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const {registerValidators} = require('./../utils/validators');
const keys = require('./../keys');
const regEmail = require('./../emails/registration');
const resetPass = require('./../emails/reset');
const router = Router();

const transporter = nodemailer.createTransport(sendinBlue({
    apiKey: keys.SENDINBLUE_API_KEY
}));

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error')
    });
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

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {rlogin, remail, rpassword} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).render('auth/login', {
                title: "Авторизация",
                isLogin: true,
                error: errors.array()[0].msg,
                data: {
                    email: remail,
                    login: rlogin
                }
            });
        }

        const hashPass = await bcrypt.hash(rpassword, 10);
        const user = await new User({
            name: rlogin,
            password: hashPass,
            email: remail,
            cart: {items: []}
        });
        await user.save();
        res.redirect('/auth/login');
        transporter.sendMail(regEmail(remail));

    } catch(e) {
        console.log(e);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
});

router.get('/password/:token', async (req, res) => {
    if(!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {    
        const user = await User.findOne({ 
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()} //у которого больше, чем Date.now()
        });

        if(!user) {
            req.flash('error', 'Время жизни токена истекло');
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }

    } catch(e) {
        console.log(e);
    }

});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            req.flash('error', 'Что-то пошло не так, повторите попытку позже');
            return res.redirect('/auth/reset');
        }

        const token = buffer.toString('hex');
        const candidate = await User.findOne({email: req.body.email});

        if (candidate) {
            candidate.resetToken = token;
            candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
            await candidate.save();
            await transporter.sendMail(resetPass(candidate.email, token));
            res.redirect('/auth/login');
        } else {
            req.flash('error', 'Такого email нет');
            res.redirect('/auth/reset');
        }
        })
    } catch (e) {
        console.log(e)
    }
});
  
router.post('/password', async (req, res) => {
    try {
        const {userId, token, password, password2} = req.body;
        const user = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            if(password === password2) {
                user.password = await bcrypt.hash(req.body.password, 10);
                user.resetToken = undefined;
                user.resetTokenExp = undefined;
                await user.save();
                res.redirect('/auth/login');
            }
        } else {
            req.flash('loginError', 'Время жизни токена истекло');
            res.redirect('/auth/login');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;