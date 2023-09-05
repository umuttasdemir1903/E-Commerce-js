// Html'den gelenler
const categoryList = document.querySelector('.categories');
const productsArea = document.querySelector('.products');
const basketBtn = document.querySelector('#basket');
const closeBtn = document.querySelector('#close');
const modal = document.querySelector('.modal-wrapper');
const basketList = document.querySelector('#list');
const totalSpan = document.querySelector('#total-price');
const totalCount = document.querySelector('#count');

//! API İşlemleri
// html'in yüklenme anı
document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProducts();
});

// yaptığımız ,isteklerin tamamında buulunur:
const baseUrl = 'https://api.escuelajs.co/api/v1';

/*
 * kategori bilgilerini alma
 * 1- Api'ye istek at
 * 2- gelen veriyi işle
 * 3- gelen verileri kart şeklinde ekrana basıcak fonksiyonu çalıştır
 * 4- cevab hatalı olursa kullanıcıyı bilgilendir
 */

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    // eğerki cevapolumlu gelirse çalışır
    .then((res) => res.json())
    // veri json formatına dönünce çalışır
    .then((data) => {
      renderCategories(data.slice(1, 5));
    })
    // cevapta hata varsa çalışır
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  // kategoriler dizisindeki herbir obje için çalışır
  categories.forEach((category) => {
    // 1- div oluşturma
    const categoryDiv = document.createElement('div');

    // 2- dive class ekleme
    categoryDiv.classList.add('category-card');
    // 3- divin içeriğini belirleme
    categoryDiv.innerHTML = `
    <img src=${category.image} />
    <p>${category.name}</p>
    `;
    // 4- elemanı htmlde categories div'ine ekleme
    categoryList.appendChild(categoryDiv);
  });
}

// Ürünler için İstek at
async function fetchProducts() {
  // isteği atar
  try {
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
    // hata olursa yakalar
  } catch (err) {
    console.log(err);
  }
}

// ürünleri ekrana basar
function renderProducts(products) {
  // her bir ürün için kart html'i oluştur ve diziye aktar
  const productsHTML = products
    .map(
      (product) => `
          <div class="card">
            <img src=${product.images[0]} />
            <h4>${product.title}</h4>
            <h4>${
              product.category.name ? product.category.name : 'Diğer'
            }</h4>
            <div class="action">
              <span>${product.price} &#8378;</span>
              <button class="btn" onclick="addToBasket({id:${product.id},title:'${
        product.title
      }',price:${product.price},img:'${
        product.images[0]
      }',amount:1})">Add to basket</button>
            </div>
          </div>
   `
    )
    // dizi şeklindeki veriyi virgülleri kaldırrak stringe dömnüştürür
    .join(' ');

  // ürünler html'ini listeye gönder
  productsArea.innerHTML += productsHTML;
}

//Sepet değişkenleri
let basket = [];
let total = 0;

//! Modal İşlemleri
basketBtn.addEventListener('click', () => {
  // sepeti açma
  modal.classList.add('active');
  // septe ürünleri listeleme
  renderBasket();
});

closeBtn.addEventListener('click', () => {
  // sepeti kapatma
  modal.classList.remove('active');
});

//! Sepet İşlemleri

// sepete ekleme işlemi
function addToBasket(product) {
  // ürün sepete daha önce eklendi mi ?
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    // eleman sepette var > miktarı arttır
    found.amount++;
  } else {
    // eleman sepette yok > sepete ekle
    basket.push(product);
  }
}

// sepete elemaları listeleme
function renderBasket() {
  // kartları oluşturma
  const cardsHTML = basket
    .map(
      (product) => `
     <div class="item">
            <img src=${product.img} />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} &#8378;</h4>
            <p>Miktar: ${product.amount}</p>
            <img onclick="deleteItem(${product.id})" id="delete" src="/images/e-trash.png" />
      </div>
  `
    )
    .join(' ');

  // hazıldaığımız kartları HTML'e gönderme
  basketList.innerHTML = cardsHTML;

  // toplam değeri hesapla
  calculateTotal();
}


function calculateTotal(){

//Dizilerde  İşlemler için reduce metodu kullanılır

// console.log(basket)

//Toplam fiyat hesablamak diziyi reduce ile dönüp işlem yapyıorz
const sum=basket.reduce((sum,i)=>sum + i.price * i.amount,0)

//Sepetteki toplam ürün sayısını hesaplıyoruz
const amount=basket.reduce((sum,i)=>sum + i.amount,0)


//Toplam Değeri HTML tarafına gönderiyoruz
totalSpan.innerText=sum


//Toplam Ürün sayısının html gönderdik
totalCount.innerText=amount + ' ' + 'Ürün'

}


//Sepetten Ürün Silme
function deleteItem(deleteid){

  //Kaldırılacak ürünler Dışındaki Tüm Ürünleri al

  basket=basket.filter((i) => i.id !== deleteid)
//console.log(basket)

//sepet listesini güncelle

renderBasket()



}