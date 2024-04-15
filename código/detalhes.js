function detalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  fetch(`https://gamesgateway.glitch.me/prod?id=${productId}`)
    .then(res => res.json())
    .then(data => {
      let str = '';
      data.forEach(prod => {
        var categoria = prod.categoria;
        produtosParecidos(categoria, productId)
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
                      <button class="btn btn-success mb-2"><i class="bi bi-cart-plus"></i> Adicionar ao carrinho</button>       
                  </div>
              </div>`;
      });
      document.getElementById('teladetalhes').innerHTML = str;
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}


$(document).ready(function () {
  // Desativa a rotação automática do carrossel
  $('#carouselExampleIndicators').carousel({
    interval: false
  });

  $('.vertical-images img').click(function () {
    var targetSlide = $(this).data('slide-to');
    $('#carouselExampleIndicators').carousel(parseInt(targetSlide));
  });
});

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