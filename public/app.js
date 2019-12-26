const priceFormat = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
};

document.querySelectorAll('.price').forEach(item => {
    item.textContent = priceFormat(item.textContent);
});

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(item => {
    item.textContent = toDate(item.textContent)
})

const cart = document.querySelector("#cart");
if(cart) {
    cart.addEventListener('click', (event) => {
        if(event.target.classList.contains('remove-course')) {
            const id = event.target.dataset.id;
            fetch(`/cart/remove/${id}`, {
                method: 'delete'
            })
            .then(res => res.json())
            .then(cart => {
                if(cart.courses.length) {
                    const result = cart.courses.map((item) => {
                        return `
                        <tr>
                            <td>
                                <a href="/courses/${item.id}">${item.title}</a>
                            </td>
                            <td>${item.count}</td>
                            <td>
                                <button class="btn btn-primary btn-small remove-course" data-id="${item.id}">Удалить</button>
                            </td>
                        </tr>
                        `
                    });
                    document.querySelector('table tbody').innerHTML = result;
                    document.querySelector('.price').textContent = priceFormat(cart.price)
                }else{
                    document.querySelector('table').outerHTML = `
                        <p>Вы еще ничего не добавили в корзину...</p>
                    `;
                    document.querySelector('.total').remove();
                    document.querySelector('.order-form').remove()
                }
            })
            .then(priceFormat())
        }
    })
}