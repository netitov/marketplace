import './index.css';
import Product from '../components/Product.js'
import ProductRender from '../components/ProductRender.js'
import { products, missingProducts } from '../utils/data';
import { productsContainer, missingProductsContainer } from '../utils/utils';


/* products render */
const productsList = new ProductRender ({
  items: products,
  renderer: (items) => {
    addProduct(items, '#productTemplate', productsList, false);
  }
}, productsContainer);

productsList.renderItems();

/* missing products render */
const missingProductsList = new ProductRender ({
  items: missingProducts,
  renderer: (items) => {
    addProduct(items, '#missingProductTemplate', missingProductsList, true);
  }
}, missingProductsContainer);

missingProductsList.renderItems();


function addProduct(card, container, copy, missingProduct) {
  const cardClass = new Product(card, container, {
    handlePopupDelete: (cardElement) => {
      //submitPopup.openPopup(cardElement, card._id)
    },
    setLike: (e, card) => {
      /* if(isLikeOwner) {

        deleteLike(evt, card, likeSum)
      }
      else {
        setLike(evt, card, likeSum)
      } */
      setLike(e, card)
    }
  }, missingProduct);
  const cardElement = cardClass.generateProduct();
  copy.addItem(cardElement);
}
