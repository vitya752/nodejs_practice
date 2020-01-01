const keys = require('./../keys');

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Сброс пароля.',
        html: `
            <h1>Забыли пароль?</h1>
            <p>Если нет, то проигнорируйте это сообщение.</p>
            <p>Иначе перейдите по следующей ссылке:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Сбросить пароль</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}