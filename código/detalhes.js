function detalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  fetch(`https://gamesgateway.glitch.me/prod?id=${productId}`)
    .then(res => res.json())
    .then(data => {
      let str = '';
      data.forEach(prod => {
        var categoria = prod.categoria;
        produtosParecidos(categoria, productId);
        str += `
              <div class="row mt-2">
                  <div class="col-md-2 col-lg-1">
                      <div class="vertical-images">
                        <img src="${prod.imagem1}" data-target="#carouselExampleIndicators" data-slide-to="0">
                        <img src="${prod.imagem2}" data-target="#carouselExampleIndicators" data-slide-to="1">
                        <img src="${prod.imagem3}" data-target="#carouselExampleIndicators" data-slide-to="2">
                        <img src="${prod.imagem4}" data-target="#carouselExampleIndicators" data-slide-to="3">
                      </div>
                  </div>
                  <div class="col-12 col-md-10 col-lg-5 mb-3">
                      <div id="carouselExampleIndicators" class="carousel carousel-dark slide" data-ride="carousel">
                          <div class="carousel-inner">
                              <div class="carousel-item active">
                                  <img class="d-block w-100" src="${prod.imagem1}" alt="First slide">
                              </div>
                              <div class="carousel-item">
                                  <img class="d-block w-100" src="${prod.imagem2}" alt="Second slide">
                              </div>
                              <div class="carousel-item">
                                  <img class="d-block w-100" src="${prod.imagem3}" alt="Third slide">
                              </div>
                              <div class="carousel-item">
                                  <img class="d-block w-100" src="${prod.imagem4}" alt="Fourth slide">
                              </div>
                          </div>
                          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next " type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                          </button>
                      </div>
                  </div>  
                  <div class="col-12 col-lg-6">
                      <h3 class="text-light">${prod.nome}</h3>
                      <hr class="text-light linhadetalheprod">
                      <h4 class="text-light">Informações Adicionais</h4>
                      <small class="text-light">${prod.caracteristica}</small>
                      <h4 class="text-danger">
                          de <s>R$${prod.de}</s> por:
                      </h4>
                      <h4 class="text-success">
                          á vista:
                          R$ ${prod.por}
                      </h4> 
                      <button class="btn btn-success mb-2" id="addCarrinho"><i class="bi bi-cart-plus"></i> Adicionar ao carrinho</button>       
                  </div>
              </div>`;
      });

      document.getElementById('teladetalhes').innerHTML = str;

      // Adicionar o event listener ao botão depois que ele for inserido no DOM
      const addCarrinhoButton = document.getElementById('addCarrinho');
      if (addCarrinhoButton) {
        addCarrinhoButton.addEventListener('click', function (event) {
          const url = new URL(window.location.href);
          const codProduto = url.searchParams.get('id');
          const usuario_id = localStorage.getItem('logado'); // Obtém o ID do usuário logado do localStorage
          
          if (!codProduto || !usuario_id) {
            alert("Error: Produto ou usuário não encontrado.");
          } else {
            fetch('http://localhost:3000/inserirCarrinho', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuario_id: usuario_id,
                codProduto: codProduto,
              }),
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Adicionado ao carrinho com sucesso!');
              } else {
                alert('erro.');
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
        });
      } else {
        console.error('Elemento com id "addCarrinho" não foi encontrado no DOM.');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function produtosParecidos(Varcategoria, Id) {
  fetch(`https://gamesgateway.glitch.me/prod?categoria=${Varcategoria}`)
    .then(res => res.json())
    .then(data => {
      let str = '';
      data.forEach(prod => {
        if (prod.id !== Id) {
          str +=
            `<div class=" col-12 col-sm-6 col-xl-3 mt-3">
              <a href="detalhes.html?id=${prod.id}">
                <div class="card bg-black">
                  <img src="${prod.imagem1}" class="imgProdutos card-img-top">
                  <div class="card-body">
                    <small class="text-light">${prod.nome}</small>
                    <div class="promopreco">
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
                </div>
              </a>
            </div>`;
        }
      });
      document.getElementById('telaprodutosparecidos').innerHTML = str;
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}
