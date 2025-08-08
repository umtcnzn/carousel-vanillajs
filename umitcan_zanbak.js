

let products = [];
let favoriteProducts = [];

const fetchProducts = async () => {

  if(localStorage.getItem('favoriteProducts')) {
      favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts'));
    }    

  if(localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
    return;
  }

  const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
  if (!response.ok) {
    throw new Error('Ürünler alınamadı: ' + response.statusText);
  }
  const data = await response.json();
  products = data;
  products.forEach(product => {
    product.discount = product.original_price > product.price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  });
  localStorage.setItem('products', JSON.stringify(products));
};

const prevSlide = () => {
  const carouselItems = document.querySelector('.carousel-items');
  carouselItems.scrollBy({
    top: 0,
    left: -(carouselItems.children[0].clientWidth + 23), // Buradaki 23 piksel, her bir ürünün sağı ve solundaki boşluklardan geliyor.
    behavior: 'smooth'
  });
};

const nextSlide = () => {
  const carouselItems = document.querySelector('.carousel-items');
  carouselItems.scrollBy({
    top: 0,
    left: carouselItems.children[0].clientWidth + 23,
    behavior: 'smooth'
  });
};

const addToFavorites = (productId, event) => {
  event.preventDefault();
  
  const product = products.find(p => p.id === productId);
  const favoriteButton = event.currentTarget;
  
  if (product) {
    const existingFavoriteIndex = favoriteProducts.findIndex(f => f == productId);
    
    if (existingFavoriteIndex === -1) {
      favoriteProducts.push(productId);
      favoriteButton.classList.add('favorited');
      console.log('Ürün favorilere eklendi:', product.name);
    } else {
      favoriteProducts.splice(existingFavoriteIndex, 1);
      favoriteButton.classList.remove('favorited');
      console.log('Ürün favorilerden kaldırıldı:', product.name);
    }
    
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
  }
};

const buildCarousel = () => {
    const html = `
    <div class="carousel-container">
        <div class="carousel-header">
            <h2 class="carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
        </div>
        <div class="carousel-wrapper">
            <button class="carousel-button prev" onclick="prevSlide()"></button>
            <div class="carousel-items">
                ${products.map(product => `
                    <div class="carousel-item">
                        <a href="${product.url}" target="_blank">
                            <div class="carousel-item-img">
                                <img src="${product.img}" alt="${product.name}">
                            </div>
                            <div class="carousel-item-content">
                                <h2 class="carousel-item-title">
                                    <b>${product.brand} - </b>
                                    <span>${product.name}</span>
                                </h2>
                                <div class="start-wrapper"></div>
                                <div class="carousel-item-price">
                                ${product.discount ? `<div class="carousel-item-old-price">
                                        <span class="old-price">${product.original_price} TL</span>
                                        <span class="discount">
                                        %${product.discount}
                                        <i class="icon icon-decrease"></i>
                                        </span>
                                    </div>
                                ` : ''}
                                    <span class="carousel-item-new-price" style=" ${product.discount ? 'color: #00a365;' : ''}">${product.price} TL</span>
                                </div>
                            </div>
                            <div class="carousel-item-favorites" onclick="addToFavorites(${product.id}, event)" data-product-id="${product.id}">
                                <img id="default-favorite-icon" src="https://cdn06.e-bebek.com/assets/svg/default-favorite.svg" alt="Add to Favorites" class="favorite-icon">
                                <img id="hover-favorite-icon" src="https://cdn06.e-bebek.com/assets/svg/default-hover-favorite.svg" alt="Add to Favorites" class="hover-favorite">
                                <div class="filled-heart"></div>
                            </div>
                        </a>
                    </div>
                `).join('')}
            </div>
            <button class="carousel-button next" onclick="nextSlide()"></button>
        </div>
    </div>
    `;
    return html;
}

const buildCSS = () => {
    const css = `
    .carousel-container {
        display: block;
        box-sizing: border-box;
        margin-left: 120px;
        margin-right: 120px;
        max-width: 1320px;
        margin: 0 auto;
        padding-left: 15px;
        padding-right: 15px;
    }
    .carousel-header {
        align-items: center;
        justify-content: space-between;
        background-color: rgb(254,246,235);
        border-top-left-radius: 35px;
        border-top-right-radius: 35px;
        box-sizing: border-box;
        display: flex;
        color: rgb(33,39,56);
        padding-bottom: 25px;
        padding-top: 25px;
        padding-left: 67px; 
        padding-right: 67px;
    }
    .carousel-title {
        color: rgb(242,142,0);
        margin: 0;
        text-align: start;
        display: block;
        font-family: 'Quicksand-bold', sans-serif;
        font-size: 28.8px;
        font-weight: 700;
    }
    .carousel-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
        background-color: rgb(255, 255, 255);
        box-shadow: rgba(235, 235, 235, 0.5) 15px 15px 30px 0px;
    }
    .carousel-items {
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        font-family: 'Poppins', cursive;
        font-size: 12px;
        overflow-y: hidden;
    }
    .carousel-item {
        min-width: 242px;
        z-index: 1;
        display: block;
        margin-right: 20px;
        border: 1px solid #ededed;
        position: relative;
        border-radius: 10px;
    }
    .carousel-item a:first-child {
        margin-left: 0px;
    }
    .carousel-item:last-child {
        margin-right: 0px;
    }
    .carousel-item a {
        text-decoration: none;
        margin: 0 0 20px 3px;
        padding: 5px;
        color: inherit;
        cursor: pointer;
    }  
    .carousel-item:hover {
        border: 4px solid rgb(242,142,0);
    }
    .carousel-item-content {
        padding: 0 17px 17px;
        padding-bottom: 13px;
        color: rgb(125,125,125);
    }
    .carousel-item-content .start-wrapper{
        padding: 5px 0 15px;
        margin-bottom: .5rem;
    }
    .carousel-item img {
        border-radius: 10px;
        background-color: #fff;
        width: 100%;
        height: auto;
        margin-bottom: 45px;
        object-fit: contain;
    }
    .carousel-item-title {
        font-size: 1.2rem;
        overflow: hidden;
        margin-bottom: 10px;
        height: 42px;
    }
    .carousel-item-price {
        display: flex;
        flex-direction: column;
        height: 43px;
        justify-content: flex-end;
        position: relative;
    }
    .carousel-item-old-price {
        align-items: center !important;
    }
    .carousel-item-old-price .old-price {
        text-decoration: line-through;
        font-size: 1.4rem;
        font-weight: 500;
    }
    .carousel-item-old-price .discount {
        color: #00a365;
        font-size: 18px;
        font-weight: 700;
        display: inline-flex;
        justify-content: center;
    }
    .carousel-item-old-price i {
        display: inline-block;
        height: 22px;
        font-size: 22px;
        margin-left: 3px;
    }
    .carousel-item-new-price {
        display:block;
        width: 100%;
        font-size: 2.2rem;
        font-weight: 600;
    }
    .carousel-item-favorites {
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
        box-shadow:0 2px 4px 0 #00000024;
        width:50px;
        height:50px;
    }
    .carousel-item-favorites img {
        z-index: 1;
        transition: opacity .1s ease-in-out;
    }
    .carousel-item-favorites #default-favorite-icon {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 13px;
        right:12px;
    }
    .carousel-item-favorites:hover #default-favorite-icon {
        opacity: 0;
    }
    .carousel-item-favorites:hover #hover-favorite-icon {
        opacity: 1;
    }
    .carousel-item-favorites #hover-favorite-icon {
        opacity: 0;
    }
    .filled-heart {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 25px;
        height: 25px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .filled-heart::before,
    .filled-heart::after {
        content: '';
        width: 13px;
        height: 20px;
        position: absolute;
        left: 50%;
        top: 10%;
        background: rgb(242,142,0);
        border-radius: 13px 13px 0 0;
        transform: rotate(-45deg);
        transform-origin: 0 100%;
    }
    .filled-heart::after {
        left: 0;
        transform: rotate(45deg);
        transform-origin: 100% 100%;
    }
    .carousel-item-favorites.favorited .filled-heart {
        opacity: 1;
    }
    .carousel-item-favorites.favorited #default-favorite-icon,
    .carousel-item-favorites.favorited #hover-favorite-icon {
        opacity: 0;
    }
    .carousel-button {
        background-color: #f1f1f1;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 50%;
        position: absolute;
        text-align: center;
        background-clip: border-box;
        background-repeat: no-repeat;
        background-position-x: 18px;
        background-position-y: 50%;
        background-size: auto;
        background-color: rgb(254,246,235);
        border-radius: 50%;
        height: 50px;
        width: 50px;
        top: 50%;
    }
    .carousel-button.prev {
        left: -65px;
        background-image: url('https://cdn06.e-bebek.com/assets/svg/prev.svg');
    }
    .carousel-button.prev:hover {
        background-color: #ffffff;
        border-color: rgb(242,142,0);
        border-style: solid;
        border-width: 1px;
    }
    .carousel-button.next {
        right: -65px;
        background-image: url('https://cdn06.e-bebek.com/assets/svg/next.svg');
    }
    .carousel-button.next:hover {
        background-color: #ffffff;
        border-color: rgb(242,142,0);
        border-style: solid;
        border-width: 1px;
    }
    
    /* Responsive Design */
    @media (max-width: 1480px) {
        .carousel-container {
            max-width: 1180px;
        }
        .carousel-item {
            min-width: 272.5px;
        }
    }
    
    @media (max-width: 1280px) {
        .carousel-container {
            max-width: 960px;
        }
        .carousel-item {
            min-width: 296.667px;
        }
        
    }
    
    @media (max-width: 990px) {
        .carousel-container {
            max-width: 720px;
        }
        .carousel-item {
            min-width: 335px;
        }

    }
    
    @media (max-width: 768px) {
        .carousel-container {
            max-width: 540px;
        }
    }    
    `;

    if(document.getElementById('umitcan-carousel-style')) return;

    const styleSheet = document.createElement("style");
    styleSheet.id = 'umitcan-carousel-style';
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
};

const findTargetElement = () => {
    const parentCarousel = document.querySelector('eb-product-carousel');

    if(!parentCarousel) {
        console.error('Parent carousel bulunamadı.');
        return null;
    }

    const insWrapper = parentCarousel.querySelector('[class*="ins-preview-wrapper"]');

    if (!insWrapper) {
        console.error('Target element bulunamadı.');
        return null;
    }
    return insWrapper;
}


const init = async () => {
  try {

    if(window.location.pathname !== '/') {
        console.log('Bu Kod sadece anasayfada çalışır.');
        return;
    }

    await fetchProducts();


    const target = findTargetElement();

    
    if (!target) {
      console.error('Target element bulunamadı.');
      return;
    }

    buildCSS();

    target.insertAdjacentHTML('afterend', buildCarousel());
    
    setTimeout(() => {
      favoriteProducts.forEach(productId => {
        const favoriteButton = document.querySelector(`[data-product-id="${productId}"]`);
        if (favoriteButton) {
          favoriteButton.classList.add('favorited');
        }
      });
    }, 100);
    
  } catch (error) {
    console.error('Yükleme sırasında hata:', error);
  }
};

init();