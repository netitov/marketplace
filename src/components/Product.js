import { formatNumber } from '../utils/utils';

export default class Product {
  constructor(card, elementTemplate, {handlePopupDelete, setLike}) {
    /* this._title = card.title;
    this._link = card.link; */
    this._elementTemplate = elementTemplate;
    this._handlePopupDelete = handlePopupDelete;

    this._card = card;
    this._setLike = setLike;
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

    this._deletetBtn = this._cardElement.querySelector('.product-card__actn-btn_delete');
    this._likeIcon = this._cardElement.querySelector('.product-card__actn-btn_like');

    const card = this._card;

    this._cardImg.src = card.link;
    this._cardTitle.textContent = !card.brand ? card.title : `${card.title}, `;
    this._cardTitle.alt = card.title;
    this._cardBrand.textContent = card.brand ? card.brand : '';
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

    //generate remainders data
    if (this._card.remainder !== '') {
      this._cardRemainder.textContent = `Осталось ${this._card.remainder} шт.`;
    } else {
      this._cardRemainder.style.display = 'none';
    }

    //generate props array
    this._generateFromArray(this._card.props, 'span', 'product-card__prop-value', this._propsContainer);

    //this._isLiked();
    this._setEventListeners();

    return this._cardElement;
  }

  /* generateProduct() {
    this._cardElement = this._getTemplate();

    const elements = {
      img: this._cardElement.querySelector('.product-card__img'),
      title: this._cardElement.querySelector('.product-card__name'),
      brand: this._cardElement.querySelector('.product-card__brand'),
      store: this._cardElement.querySelector('.product-card__store-value'),
      company: this._cardElement.querySelector('.product-card__company-name'),
      companyData: this._cardElement.querySelector('.product-card__company-tooltip-text'),
      amount: this._cardElement.querySelector('.counter__input'),
      remainder: this._cardElement.querySelector('.product-card__remainder'),
      fullSum: this._cardElement.querySelector('.product-card__sum-value'),
      sum: this._cardElement.querySelector('.product-card__sum'),
      sumDisc: this._cardElement.querySelector('.product-card__disc'),
      sumDiscValue: this._cardElement.querySelector('.product-card__disc-value'),
      sumConsDisc: this._cardElement.querySelector('.product-card__cost-disc'),
      sumCostDiscValue: this._cardElement.querySelector('.product-card__cost-disc-value'),
      propsContainer: this._cardElement.querySelector('.product-card__properties'),
    };

    const card = this._card;
    const roundedPriceAmount = Math.round(card.price * card.amount);
    const roundedDiscountedPriceAmount = Math.round(card.price * (1 - card.disc) * card.amount);
    const roundedDiscountValue = Math.round(card.price * card.amount * card.disc);
    const roundedCostDiscountValue = Math.round(card.price * card.amount * card.disc * card.costDisc);

    elements.img.src = card.link;
    elements.title.textContent = card.title;
    elements.title.alt = card.title;
    elements.brand.textContent = `, ${card.brand}`;
    elements.store.textContent = card.store;
    elements.company.textContent = card.company;
    elements.companyData.textContent = card.companyData;
    elements.amount.value = card.amount;

    elements.fullSum.textContent = `${formatNumber(roundedPriceAmount)} сом`;
    elements.sum.textContent = `${formatNumber(roundedDiscountedPriceAmount)} сом`;
    elements.sumDisc.textContent = `${Math.round(card.disc * 100)}%`;
    elements.sumDiscValue.textContent = `−${formatNumber(roundedDiscountValue)} сом`;
    elements.sumConsDisc.textContent = `${Math.round(card.costDisc * 100)}%`;
    elements.sumCostDiscValue.textContent = `−${formatNumber(roundedCostDiscountValue)} сом`;
    elements.sum.title = elements.sum.textContent;

    elements.remainder.textContent = card.remainder !== '' ? `Осталось ${card.remainder} шт` : '';
    elements.remainder.style.display = card.remainder !== '' ? 'block' : 'none';

    this._generateFromArray(card.props, 'span', 'product-card__prop-value', elements.propsContainer);
    this._setEventListeners();

    return this._cardElement;
  } */


  _generateFromArray(array, tag, className, container) {
    array.forEach(prop => {
      const propSpan = document.createElement(tag);
      propSpan.textContent = prop;
      propSpan.classList.add(className);
      container.appendChild(propSpan);
    });
  }

  _setEventListeners() {
    this._likeIcon.addEventListener('click', (e) => {
      this._setLike(e, this._card)});
    this._deletetBtn.addEventListener('click', () => {
      this._handlePopupDelete(this._cardElement)
    });
  }

  _handleLikeIcon(e) {
    e.target.classList.toggle('elements__like_active')
  }

  /* _isLiked() {
    this._card.likes.forEach(() => {
      this._likeIcon.classList.add('elements__like_active');
    })
  } */
}