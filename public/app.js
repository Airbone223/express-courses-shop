const toCurrency = price => {
   return new Intl.NumberFormat('ru-RU', {
        currency: 'usd',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            fetch('/cart/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card => {
                    if (card.courses.length) {
                        const html = card.courses.map(c => {
                            return `
                           <tr>
             <td>${c.title}</td>
             <td class="td-center">${c.count}</td>
             <td class="td-center">
                 <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
             </td>
         </tr>
                             `
                        }).join('')

                     $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(card.price)


                    } else {
                        $card.innerHTML = `<strong><p style="text-align: center; color: dimgray">
                        Вы ничего не добавили в корзину
                        </p></strong>`
                    }
                })
        }

    })
}

M.Tabs.init(document.querySelector('.tabs'))
