const path = require('path');
const fs = require('fs');

const p = path.join(__dirname, '..', 'data', 'cart.json');

class Cart {

    static async add(course) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex(item => item.id === course.id);
        const candidate = cart.courses[idx];
        if(!candidate) { //если не существует
            course.count = 1; //кол-во определенного курса в корзине
            cart.courses.push(course); //добавляем в массив наш курс, если не существует в корзине
        }else{
            candidate.count++; //увеличиваем кол-во курсов, если существует в корзине
            cart.courses[idx] = candidate;//записываем изменения в корзину
        }

        cart.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) reject(err);
                resolve(cart);
            })
        })

    }

    static async remove(id) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex(item => item.id === id);
        const course = cart.courses[idx];
        if(course.count === 1) {
            cart.courses = cart.courses.filter(i => i.id !== id);
        }else{
            cart.courses[idx].count--;
        }
        cart.price -= course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) reject(err);
                resolve(cart);
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if(err) reject(err);
                resolve(JSON.parse(content));
            })
        })
    }

}

module.exports = Cart;