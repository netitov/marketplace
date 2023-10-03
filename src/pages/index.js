import './index.css';
import Product from '../components/Product.js'
import ProductList from '../components/ProductList.js'
import { products, missingProducts } from '../utils/data';
import { productsContainer, missingProductsContainer } from '../utils/utils';

const productArray = [];
const missingProductArray = missingProducts;

/* products render */
const productsList = new ProductList ({
  items: products,
  renderer: (items) => {
    addProduct(items, '#productTemplate', productsList, false);
  }
}, productsContainer,  '#products-main');

productsList.renderItems();

/* missing products render */
const missingProductsList = new ProductList ({
  items: missingProducts,
  renderer: (items) => {
    addProduct(items, '#missingProductTemplate', missingProductsList, true);
  }
}, missingProductsContainer, '#products-missing');

missingProductsList.renderItems();

function addProduct(card, container, copy, missingProduct) {
  const cardClass = new Product(card, container, {
    setLike: (e, card) => {
      setLike(e, card)
    }
  }, missingProduct, updateProductData, removeProduct);

  const cardElement = cardClass.generateProduct();
  copy.addItem(cardElement);
}

//create array of all products data and update cart sum
function updateProductData(obj) {
  const index = productArray.findIndex(i => i.product === obj.product);
  if (index !== -1) {
    productArray[index] = obj;
  } else {
    productArray.push(obj);
  }
  productsList.updateAccordionData(productArray);
}

//remove product from array and update cart sum
function removeProduct(productName, missingProduct) {
  const products = missingProduct ? missingProductArray : productArray;

  const index = products.findIndex(i => i.product === productName);
  products.splice(index, 1);

  if (missingProduct) {
    missingProductsList.removeAccordionItem(products);
  } else {
    productsList.removeAccordionItem(products);
  }

}

productsList.setEventListeners();
missingProductsList.setEventListeners();
