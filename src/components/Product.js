import { formatNumber } from '../utils/utils';

export default class Product {
  constructor(card, elementTemplate, {handlePopupDelete, setLike}, missingCard) {
    this._elementTemplate = elementTemplate;
    this._handlePopupDelete = handlePopupDelete;
    //this._increaseCounter = increaseCounter;
    this._card = card;
    this._setLike = setLike;
    this._missingCard = missingCard;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._elementTemplate)
      .content
      .cloneNode(true);

    return cardElement;
  }

  generateProduct() {
    this._cardElement = this._getTemplate();

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
    this._counterInput = this._cardElement.querySelector('.counter__input');

    const card = this._card;

    this._cardImg.src = card.link;
    this._cardTitle.textContent = !card.brand ? card.title : `${card.title}, `;
    this._cardTitle.alt = card.title;
    this._cardBrand.textContent = card.brand ? card.brand : '';

    /* only for products in stock */
    if (!this._missingCard) {
      this._cardStore.textContent = card.store;
      this._cardCompany.textContent = card.company;
      this._cardCompanyData.textContent = card.companyData;
      this._cardAmount.value = card.amount;

      const roundedPriceAmount = Math.round(card.price * card.amount);
      const roundedDiscountedPriceAmount = Math.round(card.price * (1 - card.disc) * card.amount);
      const roundedDiscountValue = Math.round(card.price * card.amount * card.disc);
      const roundedCostDiscountValue = Math.round(card.price * card.amount * card.disc * card.costDisc);

      this._cardFullSum.textContent = `${formatNumber(roundedPriceAmount)} сом`;
      this._cardSum.textContent = `${formatNumber(roundedDiscountedPriceAmount)} сом`;
      this._cardSumDisc.textContent = Math.round(card.disc * 100) + '%';
      this._cardSumDiscValue.textContent = `−${formatNumber(roundedDiscountValue)} сом`;
      this._cardSumConsDisc.textContent = Math.round(card.costDisc * 100) + '%';
      this._cardSumCostDiscValue.textContent = `−${formatNumber(roundedCostDiscountValue)} сом`;
      this._cardSum.title = this._cardSum.textContent;

      this._counterValue = parseInt(this._counterInput.value);
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
    cardElement.remove();
  }

  _increaseCounter() {
    const currentValue = parseInt(this._counterInput.value);

    if ((this._card.remainder - currentValue) > 0) {
      this._counterInput.value = currentValue + 1;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
    }
  }

  _decreaseCounter() {
    const currentValue = parseInt(this._counterInput.value)
    if (currentValue > 1) {
      this._counterInput.value = currentValue - 1;
      this._updateSum();
      this._updateLeftovers();
      this._toggleCounterActivity();
    }
  }

  _updateSum() {
    const currentValue = parseInt(this._counterInput.value);
    const roundedPriceAmount = Math.round(this._card.price * currentValue);
    const roundedDiscountedPriceAmount = Math.round(this._card.price * (1 - this._card.disc) * currentValue);

    this._cardSum.textContent = formatNumber(roundedDiscountedPriceAmount) + ' сом';
    this._cardFullSum.textContent = formatNumber(roundedPriceAmount) + ' сом';
  }

  //generate/ update number of remaining products
  _updateLeftovers() {
    const currentValue = parseInt(this._counterInput.value);
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
    const currentValue = parseInt(this._counterInput.value);

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
  }

}
