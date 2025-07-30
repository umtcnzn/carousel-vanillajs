
const loadJQuery = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = () => resolve(window.jQuery);
    document.head.appendChild(script);
  });
};


let products = [];
let favoriteProducts = [];

const fetchProducts = async () => {

  if(localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
    return;
  } 

  const response = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  products = data;
  localStorage.setItem('products', JSON.stringify(products));
};

const prevSlide = () => {
  const carouselItems = document.querySelector('.carousel-items');
  carouselItems.scrollBy({
    top: 0,
    left: -carouselItems.children[0].clientWidth,
    behavior: 'smooth'
  });
};

const nextSlide = () => {
  const carouselItems = document.querySelector('.carousel-items');
  carouselItems.scrollBy({
    top: 0,
    left: carouselItems.children[0].clientWidth,
    behavior: 'smooth'
  });
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
                        <img src="${product.img}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.brand}</p>
                        <button class="add-to-favorites" onclick="addToFavorites('${product.id}')">Favorilere Ekle</button>
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
    }
    .carousel-item {
        min-width: 240px;
        margin-right: 20px;
        text-align: center;
        border-radius: 10px;
        border-color: rgb(237,237,237);
        border-style: solid;
        border-width: 1px;
    }
    .carousel-item:hover {
        border-color: rgb(242,142,0);
        border-width: 4px;
    }
    .carousel-item img {
        border-radius: 10px;
        width: 100%;
        height: auto;
    }
    .add-to-favorites {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        cursor: pointer;
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
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
};


const init = async () => {
  try {
    await loadJQuery();
    await fetchProducts();
    const target = document.querySelector('.ins-preview-wrapper.ins-preview-wrapper-28406');
    console.log('Products fetched and jQuery loaded successfully');
    console.log(products);
    buildCSS();
    if (!target) {
      console.error('Target element not found');
      return;
    }
    target.insertAdjacentHTML('afterend', buildCarousel());
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};

init();
