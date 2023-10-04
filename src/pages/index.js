import './index.css';
import Product from '../components/Product.js'
import ProductList from '../components/ProductList.js'
import DeliveryPopup from '../components/DeliveryPopup';
import AddressList from '../components/AddressList';
import { products, missingProducts, addressesData, pickupAddressesData } from '../utils/data';
import { productsContainer, missingProductsContainer, deliveryChangeBtn,
  deliveryPopupSelector, courierAddressBox, pickupAddressBox } from '../utils/utils';

//products in cart
const productArray = [];
const missingProductArray = missingProducts;

const deliveryPopup = new DeliveryPopup(deliveryPopupSelector, '#adressTemplate', toggleAddresses);

//main products object
const couirerAddresses = new AddressList ({
  renderer: (item) => renderAddress(item, couirerAddresses)
}, addressesData, courierAddressBox);

//main products object
const pickupAddresses = new AddressList ({
  renderer: (item) => renderAddress(item, pickupAddresses)
}, pickupAddressesData, pickupAddressBox);


//main products object
const productsList = new ProductList ({
  items: products,
  renderer: (items) => {
    addProduct(items, '#productTemplate', productsList, false);
  }
}, productsContainer,  '#products-main');

//missing products object
const missingProductsList = new ProductList ({
  items: missingProducts,
  renderer: (items) => {
    addProduct(items, '#missingProductTemplate', missingProductsList, true);
  }
}, missingProductsContainer, '#products-missing');


//add product to list
function addProduct(card, container, copy, missingProduct) {
  const cardClass = new Product(card, container, {
    setLike: (e, card) => {
      setLike(e, card)
    }
  }, missingProduct, updateProductData, removeProduct);

  const cardElement = cardClass.generateProduct();
  copy.addItem(cardElement);
}

function renderAddress(item, copy) {
  const element = deliveryPopup.generateAddress(item);
  copy.addItem(element);
}

//update product data: sum and amount
function updateProductData(obj) {
  const index = productArray.findIndex(i => i.product === obj.product);
  if (index !== -1) {
    productArray[index] = obj;
  } else {
    productArray.push(obj);
  }
  productsList.updateAccordionData(productArray);
}

//remove product from list
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

//toggle addresses type: courier or pick up
function toggleAddresses() {
  couirerAddresses.toggleAddresses();
  pickupAddresses.toggleAddresses();
}

missingProductsList.renderItems();
productsList.renderItems();
couirerAddresses.renderItems();
pickupAddresses.renderItems();

//open delivery popup
deliveryChangeBtn.addEventListener('click', () => {
  deliveryPopup.openPopup();
});

productsList.setEventListeners();
missingProductsList.setEventListeners();
deliveryPopup.setEventListeners();
