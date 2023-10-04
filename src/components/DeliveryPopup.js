import Popup from './Popup.js'

export default class DeliveryPopup extends Popup {
  constructor (popupSelector, addressTemplate, toggleAddresses) {
    super(popupSelector);
    this._addressTemplate = addressTemplate;
    this._formElement = this._popupSelector.querySelector('.form-delivery');
    this._popupSbtBtn = this._formElement.querySelector('.popup__sbt-btn');
    this._deliveryBtnCourier = this._popupSelector.querySelector('.form-delivery__del-courier');
    this._deliveryBtnPickup = this._popupSelector.querySelector('.form-delivery__del-pickup');
    this._courierAddressBox = this._popupSelector.querySelector('.form-delivery__adress-box-courier');
    this._pickupAddressBox = this._popupSelector.querySelector('.form-delivery__adress-box-pickup');
    this._initialSbtBtn = this._popupSbtBtn.textContent;
    this._toggleDeliveryType = this._toggleDeliveryType.bind(this);
    this.toggleAddresses = toggleAddresses;
  }

  openPopup() {
    super.openPopup();
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._addressTemplate)
      .content
      .cloneNode(true);

    return cardElement;
  }

  generateAddress(adressData) {
    this._address = this._getTemplate();
    this._addressValue = this._address.querySelector('.radio-btn__value');
    this._input = this._address.querySelector('.radio-btn__input');
    this._deleteBtn = this._address.querySelector('.form-delivery__dlt-btn');

    this._addressValue.textContent = adressData.address;
    this._input.name = adressData.type;
    this._input.checked = adressData.checked;

    const addressElement = this._deleteBtn.closest('.form-delivery__adress-wrapper');
    this._deleteBtn.addEventListener('click', () => this._removeAddress(addressElement, adressData.type));

    return this._address;
  }

  generatePickupAddress(pickupAdressData) {
    this._generatedAddress = this.generateAddress(pickupAdressData);
    this._rating = this._generatedAddress.querySelector('.form-delivery__rating-value');

    this._rating.textContent = pickupAdressData.rating;

    return this._generatedAddress;
  }

  _toggleDeliveryType(e) {
    //toggle active btn
    if (!e.target.classList.contains('form-delivery__del-type_active')) {
      if (this._deliveryBtnCourier.textContent === e.target.textContent) {
        this._deliveryBtnPickup.classList.remove('form-delivery__del-type_active');
        this._deliveryBtnCourier.classList.add('form-delivery__del-type_active');
      } else {
        this._deliveryBtnPickup.classList.add('form-delivery__del-type_active');
        this._deliveryBtnCourier.classList.remove('form-delivery__del-type_active');
      }

      //toggle address list
      this.toggleAddresses();
    }
  }

  _removeAddress(addressElement, addressType) {
    addressElement.remove();
    this._updateActiveRadioBtn(addressType);
  }

  //update active radio btn when address deleted
  _updateActiveRadioBtn(addressType) {
    const addressElementBox = addressType === 'pickUp' ? this._pickupAddressBox : this._courierAddressBox;
    const remainingRadioButtons = addressElementBox.querySelectorAll('.radio-btn__input');

    let checkedButtonFound = false;
    for (const radioButton of remainingRadioButtons) {
      if (radioButton.checked) {
        checkedButtonFound = true;
        break;
      }
    }

    if (!checkedButtonFound && remainingRadioButtons.length > 0) {
      remainingRadioButtons[0].checked = true;
    }
  }

  setEventListeners () {
    super.setEventListeners();
    this._deliveryBtnCourier.addEventListener('click', this._toggleDeliveryType);
    this._deliveryBtnPickup.addEventListener('click', this._toggleDeliveryType);

  }

}
