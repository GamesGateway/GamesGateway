function somaCarrinho(produtos) {
    var soma = 0;
    var promises = produtos.map(id => {
        return fetch(`https://gamesgateway.glitch.me/prod?id=${id}`)
            .then(res => res.json())
            .then(data => {
                soma += data[0].por;
            });
    });

    Promise.all(promises).then(() => {
        document.getElementById("somaCarrinho").innerHTML = soma.toFixed(2);
    });
}

function carrinho(produtos) {
    produtos.forEach(id => {
        fetch(`https://gamesgateway.glitch.me/prod?id=${id}`)
            .then(res => res.json())
            .then(data => {
                let str = '';
                str += `
                    <div class="row">
                        <div class="col-2">
                            <img src="${data[0].imagem1}" alt="Descrição da imagem" class="w-50 mt-5">
                        </div>
                        <div class="col-7 mt-5">
                            <small class="mt-5 text-light">${data[0].caracteristica}</small>
                        </div>
                        <div class="col-2">
                            <p class="mt-5 text-light">R$ ${data[0].por}</p>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-danger mt-5" data-id="${data[0].id}" id="remover"><i class="bi bi-trash3-fill" data-id="${data[0].id}" id="remover"></i></button>
                        </div>
                    </div>
                </div>`;
                document.getElementById('telacarrinho').innerHTML += str; // Adicionei a div com id 'carrinho'
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('telacarrinho').addEventListener('click', function (event) {
        if (event.target && event.target.id === 'remover') {
            const produto_id = event.target.getAttribute('data-id');
            console.log(produto_id);
            fetch('http://localhost:3000/removerCarrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produto_id: produto_id,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Removido com sucesso!');
                        location.reload();
                    } else {
                        alert('Carrinho vazio.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar carrinho:', error);
                });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const usuario_id = localStorage.getItem('logado');
    fetch('http://localhost:3000/carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario_id: usuario_id,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.produtos);
                carrinho(data.produtos);
                somaCarrinho(data.produtos);
            } else {
                alert('Carrinho vazio.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar carrinho:', error);
        });
});
