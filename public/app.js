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

const tabsWrap = document.querySelector('.tabs-content-wrap');
if(tabsWrap) {
    tabsWrap.addEventListener('click', (e) => {
        if(event.target.classList.contains('tab')) {
            const tabs = document.querySelectorAll('.tab');
            const tabsContent = document.querySelectorAll('.tab-pane');
            const array = Array.from(tabs);
            const target = event.target;
            const idx = array.findIndex((i) => i === event.target);
    
            if(target.classList.contains('active')) return;
    
            tabs.forEach((item) => {
                item.classList.remove('active');
            });
            tabsContent.forEach((item) => {
                item.classList.remove('active');
            });
            target.classList.add('active');
            tabsContent[idx].classList.add('active');
        }
    });
}

const cart = document.querySelector("#cart");
if(cart) {
    cart.addEventListener('click', (event) => {
        if(event.target.classList.contains('remove-course')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch(`/cart/remove/${id}`, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
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