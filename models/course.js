const fs = require('fs'),
    path = require('path'),
    uuid = require('uuid/v4');

class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON() {//на самом деле возвращает просто объект с данными
        return {
           title: this.title,
           price: this.price,
           img: this.img,
           id: this.id
        };
    }

    async add() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());
        return Course.save(courses);
    }

    static async save(courses) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses), //а вот тут уже переводим в json
                (err) => {
                    if(err) reject(err);
                    else resolve();
                }
            );
        })
    }

    static async updateCourse(course) {
        const courses = await Course.getAll();
        console.log(course.id);
        const idx = courses.findIndex( item => item.id === course.id);
        let newArray = [ 
            ...courses.slice(0, idx),
            course,
            ...courses.slice(idx + 1)
        ];
        return await Course.save(newArray);
    }

    static async getCourse(id) {
        const courses = await Course.getAll();
        return courses.find(item => item.id === id );
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if(err) reject(err);
                    else resolve(JSON.parse(content));
                }
            )
        });
    }

}

module.exports = Course;