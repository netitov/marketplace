import { formatNumber, declenWords, productWords } from '../utils/utils';

export default class ProductList {
  constructor ({ items, renderer }, containerSelector, listSelector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = containerSelector;
    this._listSelector = document.querySelector(listSelector);
    this.addItem = this.addItem.bind(this);
    this._accordionIcon = this._listSelector.querySelector('.products__accordion-icon');
    this._productList = this._listSelector.querySelector('.products__list');
    this._accordionAmount = this._listSelector.querySelector('.products__accordion-amount');
    this._accordionAmountMissing = this._listSelector.querySelector('.products__accordion-amount-missing');
    this._accordionSum = this._listSelector.querySelector('.products__accordion-sum');
    this._orderSum = document.querySelector('.order__sum-main-value');
    this._orderAmount = document.querySelector('.order__amount');
    this._orderTotalPrice = document.querySelector('.order__sum-no-disc');
    this._orderDiscount = document.querySelector('.order__sum-discount');
    this._payNowCheckbox = document.querySelector('.order__checkbox-input');
    this._payNowText = document.querySelectorAll('.order__paynow-text');
    this._formSubmitBtn = document.querySelector('.order__sbt-btn');
    this._cartProductsAmount = document.querySelector('.navbar__number');
    this._handlePayNowCheckbox = this._handlePayNowCheckbox.bind(this);
  }

  renderItems() {
    const items = this._renderedItems.reverse();

    items.forEach((item) => {
      this._renderer(item);
    });

    //set max height for poduct list for accordion transition
    this._updateAccordionHeight();

    if (this._accordionAmountMissing) {
      this._getMissingProductsData(items);
    }
  }

  //update accordion data: all products amount and sum
  updateAccordionData(data) {
    this._totalAmount = data.reduce((sum, product) => sum + product.amount, 0);
    this._totalSum = data.reduce((sum, product) => sum + product.price, 0);
    this._fullPrice = data.reduce((sum, product) => sum + product.fullPrice, 0);

    const goodsAmountString = `${formatNumber(this._totalAmount)} ${declenWords(this._totalAmount, productWords)}`;

    if (this._accordionAmountMissing) {
      this._getMissingProductsData(data);
    } else {
      this._accordionAmount.textContent = `${goodsAmountString} ·`;
      const fullSumFormatted = formatNumber(this._totalSum);
      this._accordionSum.textContent = fullSumFormatted + ' сом';
      this._orderSum.textContent = fullSumFormatted;
      this._orderSum.title = fullSumFormatted + ' сом';
      this._orderAmount.textContent = goodsAmountString;
      this._orderTotalPrice.textContent = formatNumber(this._fullPrice) + ' сом';
      this._orderDiscount.textContent = formatNumber(this._fullPrice - this._totalSum) + ' сом';
      if (this._payNowCheckbox.checked) this._formSubmitBtn.textContent = `Оплатить ${fullSumFormatted} сом`;

      if (this._totalAmount === 0) {
        this._formSubmitBtn.classList.add('order__sbt-btn_inactive');
        this._formSubmitBtn.disabled = true;
        this._payNowCheckbox.disabled = true;
        this._formSubmitBtn.textContent = 'Заказать';
      }

      if (data.length === 0) {
        this._cartProductsAmount.parentElement.classList.add('navbar__number-box_inactive');
      } else {
        this._cartProductsAmount.parentElement.classList.remove('navbar__number-box_inactive');
        this._cartProductsAmount.textContent = data.length;
      }

    }
  }

  _handlePayNowCheckbox(e) {
    const textArray = Array.from(this._payNowText);

    if (e.target.checked) {
      textArray.forEach((i) => {
        i.classList.add('order__paynow-text_inactive');
      });
      this._formSubmitBtn.textContent = `Оплатить ${formatNumber(this._orderSum.textContent)} сом`;
    } else {
      textArray.forEach((i) => {
        i.classList.remove('order__paynow-text_inactive');
      })
      this._formSubmitBtn.textContent = 'Заказать';
    }
  }

  removeAccordionItem(data) {
    this.updateAccordionData(data);
    this._updateAccordionHeight();
  }

  //set max height for poduct list for accordion transition
  _updateAccordionHeight() {
    this._productListHeight = this._productList.offsetHeight;
    this._productList.style.maxHeight = this._productListHeight + 'px';
  }

  _getMissingProductsData(arr) {
    const str = arr.length.toString();
    const verb = str.substring(str.length - 1) === '1' ? 'Отсутствует' : 'Отсутствуют'
    this._accordionAmountMissing.textContent = `${verb} · ${formatNumber(arr.length)} ${declenWords(arr.length, productWords)}`;
  }

  addItem(element, box) {
    box.prepend(element);
  }

  //close and open accordion
  _handleAccordion() {
    if (this._listSelector.classList.contains('products_hidden')) {
      this._productList.style.maxHeight = this._productListHeight + 'px';
    } else {
      this._productList.style.maxHeight = 0;
    }
    this._listSelector.classList.toggle('products_hidden');
  }

  setEventListeners() {
    this._accordionIcon.addEventListener('click', () => {
      this._handleAccordion();
    });

    if (!this._accordionAmountMissing) {
      this._payNowCheckbox.addEventListener('click', this._handlePayNowCheckbox);
    }

  }

}
