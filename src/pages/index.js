import './index.css';
import Product from '../components/Product.js'
import ProductList from '../components/ProductList.js'
import DeliveryPopup from '../components/DeliveryPopup';
import AddressList from '../components/AddressList';
import DeliveryDates from '../components/DeliveryDates';
import PaymentPopup from '../components/PaymentPopup';
import { FormValidator } from '../components/FormValidator';
import { products, missingProducts, addressesData, pickupAddressesData, deliveryDates, bankCards, companyData } from '../utils/data';
import {
  productsContainer, missingProductsContainer, deliveryPopupSelector, courierAddressBox, pickupAddressBox,
  deliveryContainer, paymentChangeBtns, paymentPopupSelector, cardsContainerSelector, cartFormElement,
  cartFormElements, inputErrros, addressChangeBtn, scrollButton, targetElement, payNowCheckbox, payNowText, formSubmitBtn, formatNumber
} from '../utils/utils';

//products in cart
const productArray = [];
const missingProductArray = missingProducts;
// /let orderSum;

//delivery dates and thumbnails
const deliveryDatesList = new DeliveryDates(deliveryDates, deliveryContainer, '#delivery-date-template');
const paymentPopup = new PaymentPopup(paymentPopupSelector, '#bank-card-template', bankCards, cardsContainerSelector);
const deliveryPopup = new DeliveryPopup(deliveryPopupSelector, '#adressTemplate',
  toggleAddresses, addressesData[0], pickupAddressesData[0])
;
const formValidation = new FormValidator(cartFormElements, cartFormElement, inputErrros)

//courier address object
const couirerAddresses = new AddressList ({
  renderer: (item) => renderAddress(item, couirerAddresses)
}, addressesData, courierAddressBox);

//pickup address object
const pickupAddresses = new AddressList ({
  renderer: (item) => renderAddress(item, pickupAddresses)
}, pickupAddressesData, pickupAddressBox);


//main products object
const productsList = new ProductList ({
  items: products,
  renderer: (items) => {
    addProduct(items, '#productTemplate', productsList, false, productsContainer);
  }
}, productsContainer,  '#products-main');

//missing products object
const missingProductsList = new ProductList ({
  items: missingProducts,
  renderer: (items) => {
    addProduct(items, '#missingProductTemplate', missingProductsList, true, missingProductsContainer);
  }
}, missingProductsContainer, '#products-missing');


//add product to list
function addProduct(card, template, copy, missingProduct, appendBox) {
  const cardClass = new Product(card, template, {
    setLike: (e, card) => {
      setLike(e, card)
    }
  }, missingProduct, updateProductData, removeProduct, updateThumbnails, companyData, products);

  const cardElement = cardClass.generateProduct();
  copy.addItem(cardElement, appendBox);
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
  //orderSum = productArray.reduce((sum, product) => sum + product.price, 0);
  productsList.updateAccordionData(productArray);

  //return orderSum;

}

//remove product from list
function removeProduct(productName, missingProduct, id) {
  const products = missingProduct ? missingProductArray : productArray;

  const index = products.findIndex(i => i.product === productName);
  products.splice(index, 1);

  if (missingProduct) {
    missingProductsList.removeAccordionItem(products);
  } else {
    productsList.removeAccordionItem(products);
    deliveryDatesList.removeThumbnail(id);
  }
}

//update products amount in thumbnails
function updateThumbnails(card, newValue, currentValue) {
  deliveryDatesList.updateThumbnails(card, newValue, currentValue);
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
deliveryDatesList.renderItems();
paymentPopup.renderItems();


document.addEventListener('DOMContentLoaded', () => {
  //scroll to element on click
  function scrollToTarget(targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  };

  scrollButton.addEventListener('click', () => scrollToTarget(targetElement));
});


//open delivery popup
addressChangeBtn.forEach((i) => {
  i.addEventListener('click', () => {
    deliveryPopup.openPopup();
  });
})

//open payment popup
paymentChangeBtns.forEach((i) => {
  i.addEventListener('click', () => {
    paymentPopup.openPopup();
  });
})

productsList.setEventListeners();
missingProductsList.setEventListeners();
deliveryPopup.setEventListeners();
paymentPopup.setEventListeners();
formValidation.enableValidation();
