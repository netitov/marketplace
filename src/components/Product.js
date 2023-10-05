import { formatNumber } from '../utils/utils';

export default class Product {
  constructor(card, elementTemplate, { setLike }, missingCard, updateProductData, removeProduct, updateThumbnails) {
    this._elementTemplate = elementTemplate;
    //this._thumbnailTemplate = thumbnailTemplate;
    this._card = card;
    this._setLike = setLike;
    this._missingCard = missingCard;
    this._updateProductData = updateProductData;
    this._removeProduct = removeProduct;
    this._updateThumbnails = updateThumbnails;
    this._prevValue;
  }

  _getTemplate(template) {
    const cardElement = document
      .querySelector(template)
      .content
      .cloneNode(true);

    return cardElement;
  }

  generateProduct() {
    this._cardElement = this._getTemplate(this._elementTemplate);

    this._cardImg = this._cardElement.querySelector('.product-card__img');
    this._cardTitle = this._cardElement.querySelector('.product-card__name');
    this._cardBrand = this._cardElement.querySelector('.product-card__brand');
    this._propsContainer = this._cardElement.querySelector('.product-card__properties');
    this._cardStore = this._cardElement.querySelector('.product-card__store-value');
    this._cardCompany = this._cardElement.querySelector('.product-card__company-name');
    this._cardCompanyData = this._cardElement.querySelector('.product-card__company-tooltip-text');
    this._cardAmount = this._cardElement.querySelector('.counter__input');
    this._cardRemainder = this._cardElement.querySelector('.product-card__remainder');
    this._cardSum = this._cardElement.querySelector('.product-card__sum');
    this._cardFullSum = this._cardElement.querySelector('.product-card__sum-value');
    this._cardSumDisc = this._cardElement.querySelector('.product-card__disc');
    this._cardSumDiscValue = this._cardElement.querySelector('.product-card__disc-value');
    this._cardSumConsDisc = this._cardElement.querySelector('.product-card__cost-disc');
    this._cardSumCostDiscValue = this._cardElement.querySelector('.product-card__cost-disc-value');
    this._deletetBtn = this._cardElement.querySelector('.product-card__actn-btn-delete');
    this._likeIcon = this._cardElement.querySelector('.product-card__actn-btn-like');
    this._plusBtn = this._cardElement.querySelector('.counter__btn_plus');
    this._minusBtn = this._cardElement.querySelector('.counter__btn_minus');

    const card = this._card;

    this._cardImg.src = card.link;
    this._cardTitle.textContent = !card.brand ? card.title : `${card.title}, `;
    this._cardTitle.alt = card.title;
    this._cardBrand.textContent = card.brand ? card.brand : '';

    //only for products in stock
    if (!this._missingCard) {
      this._cardStore.textContent = card.store;
      this._cardCompany.textContent = card.company;
      this._cardCompanyData.textContent = card.companyData;
      this._cardAmount.value = card.amount.reduce((acc, current) => acc + current.amount, 0);
      this._prevValue = card.amount.reduce((acc, current) => acc + current.amount, 0)

      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
    }

    //generate props array
    this._generateFromArray(this._card.props, 'span', 'product-card__prop-value', this._propsContainer);

    //this._isLiked();
    this._setEventListeners();

    return this._cardElement;
  }

  _generateFromArray(array, tag, className, container) {
    array.forEach(prop => {
      const propSpan = document.createElement(tag);
      propSpan.textContent = prop;
      propSpan.classList.add(className);
      container.appendChild(propSpan);
    });
  }

  //add or remove like
  _toggleLike(e) {
    e.target.classList.toggle('product-card__actn-btn-like_active')
  }

  //remove card from the list
  _removeCard() {
    const cardElement = this._deletetBtn.closest('.product-card');
    //if (!this._missingCard) this._updateSum();
    cardElement.remove();

    this._removeProduct(this._card.title, this._missingCard, this._card.id);
  }

  _increaseCounter() {
    const currentValue = parseInt(this._cardAmount.value);
    if ((this._card.remainder - currentValue) > 0) {
      const newValue = currentValue + 1;
      this._cardAmount.value = newValue;
      this._prevValue = newValue;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
      this._updateThumbnails(this._card, newValue, currentValue);
    }
  }

  _decreaseCounter() {
    const currentValue = parseInt(this._cardAmount.value)
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      this._cardAmount.value = newValue;
      this._prevValue = newValue;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
      this._updateThumbnails(this._card, newValue, currentValue);
    }
  }

  //handle update product amount on input change
  _changeInputCounter(data) {
    const newValue = parseInt(data);

    if (newValue < 1) {
      this._cardAmount.value = 1;
    }

    if ((this._card.remainder - newValue) < 0) {
      this._cardAmount.value = this._card.remainder;
    }

    this._updateSum();
    this._updateLeftovers();
    this._toggleCounterActivity();
    this._updateThumbnails(this._card, parseInt(this._cardAmount.value, 10), this._prevValue);
    this._prevValue = parseInt(this._cardAmount.value, 10);
  }

  //update product sum when amount is changed
  _updateSum() {
    const currentValue = parseInt(this._cardAmount.value);
    const roundedPriceAmount = Math.round(this._card.price * currentValue);
    const roundedDiscountedPriceAmount = Math.round(this._card.price * (1 - this._card.disc) * currentValue);
    const roundedDiscountValue = Math.round(this._card.price * currentValue * this._card.disc);
    const roundedCostDiscountValue = Math.round(this._card.price * currentValue * this._card.disc * this._card.costDisc);

    //product cost
    this._cardSum.textContent = formatNumber(roundedDiscountedPriceAmount) + ' сом';
    this._cardFullSum.textContent = formatNumber(roundedPriceAmount) + ' сом';
    this._cardSum.title = this._cardSum.textContent;

    //discount data
    this._cardSumDiscValue.textContent = `−${formatNumber(roundedDiscountValue)} сом`;
    this._cardSumCostDiscValue.textContent = `−${formatNumber(roundedCostDiscountValue)} сом`;

    this._updateProductData({ product: this._card.title, price: roundedDiscountedPriceAmount, amount: currentValue });
  }

  //update number of remaining products
  _updateLeftovers() {
    const currentValue = parseInt(this._cardAmount.value);
    if ((this._card.remainder - currentValue) < 3) {
      this._cardRemainder.textContent = `Осталось ${this._card.remainder - currentValue} шт.`;
      if (this._cardRemainder.style.display === 'none' ) {
        this._cardRemainder.style.display = 'block'
      }
    } else {
      this._cardRemainder.style.display = 'none';
    }
  }

  //activate/deactivate counter btns
  _toggleCounterActivity() {
    const currentValue = parseInt(this._cardAmount.value);

    //toggle minus btn
    if (currentValue < 2) {
      this._minusBtn.classList.add('counter__btn_inactive');
    } else if (this._minusBtn.classList.contains('counter__btn_inactive')) {
      this._minusBtn.classList.remove('counter__btn_inactive');
    }

    //toggle plus btn
    if ((this._card.remainder - currentValue) === 0) {
      this._plusBtn.classList.add('counter__btn_inactive');
    } else if (this._plusBtn.classList.contains('counter__btn_inactive')) {
      this._plusBtn.classList.remove('counter__btn_inactive');
    }
  }

  _setEventListeners() {
    this._likeIcon.addEventListener('click', (e) => {
      this._toggleLike(e)
    });
    this._deletetBtn.addEventListener('click', () => {
      this._removeCard();
    });
    if (this._plusBtn) this._plusBtn.addEventListener('click', () => {
      this._increaseCounter();
    });
    if (this._minusBtn) this._minusBtn.addEventListener('click', () => {
      this._decreaseCounter();
    });
    if (this._cardAmount) this._cardAmount.addEventListener('change', (e) => {
      this._changeInputCounter(e.target.value);
    });
  }

}
