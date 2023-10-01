import './index.css';
import Product from '../components/Product.js'
import ProductRender from '../components/ProductRender.js'
import { products } from '../utils/data';
import { productsContainer } from '../utils/utils';


/* products render */
const productsList = new ProductRender ({
  items: products,
  renderer: (items) => {
    addProduct(items);
  }
}, productsContainer);

productsList.renderItems();


function addProduct(card) {
  const cardClass = new Product(card, '#productTemplate', {
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
  });
  const cardElement = cardClass.generateProduct();
  productsList.addItem(cardElement);
}
