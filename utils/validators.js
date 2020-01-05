const {body} = require('express-validator');
const User = require('./../models/user');

exports.registerValidators = [
    body('remail', 'Регистрация: Невалидный email.').isEmail().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value});

            if(user) {
                return Promise.reject('Регистрация: Такой email уже зарегистрирован.');
            }

        } catch(e) {
            console.log(e);
        }
    }),
    body('rpassword', 'Регистрация: Пароли не совпадают.').custom((value, {req}) => {
        if(value !== req.body.rpassword2) {
            return;
            // throw new Error('Регистрация: Пароли не совпадают.');
        }
        return true;
    }),
    body('rpassword', 'Регистрация: Пароль должен быть минимум 6 символов и содержать латиницу')
        .isLength({min: 6, max: 56})
        .isAlphanumeric(),
    body('rlogin', 'Регистрация: Имя должно быть минимум 3 символа').isLength({min: 3, max: 56})
];

exports.courseValidators = [
    body('title', 'Заголовок должен быть минимум из 3-ех символов.').isLength({min: 3}),
    body('price', 'Введите корректную цену').isNumeric(),
    body('img', 'Введите корректный URL картинки').isURL()
];