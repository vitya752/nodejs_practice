const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarURL: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: "Course",
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(course) {//наши функции не должны что-то возвращать,
    //лишь только обновить базу
    //а нужные нам данные мы возьмем после окончания выполнения функции
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex(item => item.courseId.toString() === course._id.toString());

    if(idx >= 0) {
        clonedItems[idx].count = clonedItems[idx].count + 1;
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        });
    }

    const newCart = {items: clonedItems};
    this.cart = newCart;

    return this.save();
};

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(item => item.courseId.toString() === id.toString());
    
    if(items[idx].count === 1) {
        items = items.filter(item => item.courseId.toString() !== id.toString());
    } else {
        items[idx].count--;
    }

    const newCart = {items};
    this.cart = newCart;

    return this.save();

};

userSchema.methods.clearCart = function() {
    this.cart = [];
    this.save();
}

module.exports = model('User', userSchema);