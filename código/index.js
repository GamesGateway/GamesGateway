function produtos() {
  document.getElementById('tela').innerHTML = 
  `<div class="col-12 mt-2">
      <center>
      <h3 class="text-success">Aguarde</h4>
      <p class="text-light fs-4">Pedimos desculpas pela demora.<br> Estamos carregando os produtos para você.<br> Por favor, aguarde um momento enquanto buscamos as melhores ofertas.<br> Obrigado pela sua paciência!</p>
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      </center>
    </div>`;

  fetch(`https://gamesgateway.glitch.me/prod`)
    .then(res => res.json())
    .then(data => {
      let str = '';
      // Iterando sobre todos os produtos retornados
      data.forEach(prod => {
        str +=
          `<div class=" col-12 col-sm-6 col-xl-3 mt-4">
              <a href="detalhes.html?id=${prod.id}">
                <div class="card bg-black">
                  <img src="${prod.imagem1}" class="imgProdutos card-img-top">
                  <div class="card-body">
                    <small class="text-light">${prod.nome}</small><br>
                      <small class="text-danger">
                        de <s>R$${prod.de}</s> por:
                      </small>
                      <br>
                      <small class="text-success">
                        á vista:
                      </small>
                      <h5 class="text-success">R$ ${prod.por}</h5>     
                  </div>
                </div>
              </a>
            </div>`;
      });
      document.getElementById('tela').innerHTML = str;
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function pagamento() {
  document.getElementById('tela_pagamento').innerHTML = 
  `<div class="col-12 d-flex">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>`;

  fetch(`https://gamesgateway.glitch.me/pag`)
    .then(res => res.json())
    .then(data => {
      let str = '';
      // Iterando sobre todas as imagens de pagamento retornadas
      data.forEach(pagamento => {
        str += `<img src="${pagamento.imagem}" title="${pagamento.title}" class="imgPagamento">`;
      });
      document.getElementById('tela_pagamento').innerHTML = str;
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function pesquisa() {
  const pesquisa = document.getElementById('pesquisa');
  const searchResults = document.getElementById('searchResults');
  // Função para mostrar os resultados da pesquisa
  function showResults(results) {
    // Limpa os resultados anteriores
    searchResults.innerHTML = '';
    // Adiciona os novos resultados
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('row');
      resultItem.innerHTML = result;
      searchResults.appendChild(resultItem);
    });
    // Exibe os resultados
    searchResults.style.display = 'block';
  }
  // Função para esconder os resultados da pesquisa
  function hideResults() {
    searchResults.style.display = 'none';
  }
  // Evento de digitação no campo de pesquisa
  pesquisa.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    fetch(`https://gamesgateway.glitch.me/prod?nome=${searchTerm}`)
      .then(res => res.json())
      .then(data => {
        if (searchTerm.length === 0 || data.length === 0) {
          hideResults();
        } else {
          // Mapear os resultados para um array de strings HTML
          const resultsHTML = data.map(prod =>
            `<div class="mt-1 mb-1 m-2 pesquisaProd">
              <a href="detalhes.html?id=${prod.id}" class="row"> 
                <div class="col-2 col-md-1"> 
                 <center>
                  <img src="${prod.imagem1}" class="imgPesquisa">
                  </center>
                </div>
                <div class="col-9">
                  <small class="text-light">${prod.nome}</small>
                </div>
                <div class="col-2">
                  <small class="text-light">R$${prod.por}</small>
                </div>
              </a>
            </div>`);
          showResults(resultsHTML); // Passar o array de HTML para a função showResults
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        hideResults();
      });
  });
  
  // Evento de clique fora do modal de resultados para fechar
  document.addEventListener('click', function (event) {
    if (!searchResults.contains(event.target) && event.target !== pesquisa) {
      hideResults();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  pesquisa();
});
