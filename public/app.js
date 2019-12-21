// document.querySelectorAll('.price').forEach(item => {
//     item.textContent = new Intl.NumberFormat('ru-RU', {
//         currency: 'rub',
//         style: 'currency'
//     }).format(item.textNode)
// })

const cart = document.getElementById("cart");
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
                    document.querySelector('.total span').innerHTML = cart.price;
                }else{
                    document.querySelector('table').outerHTML = `
                        <p>Вы еще ничего не добавили в корзину...</p>
                    `;
                    document.querySelector('.total').remove()
                }
            })
        }
    })
}