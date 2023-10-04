export const productsContainer = document.querySelector('.products__list');
export const missingProductsContainer = document.querySelector('.products__list_missing');
export const deliveryChangeBtn = document.querySelector('.cart-form__card-btn');
export const deliveryPopupSelector = document.querySelector('.popup-delivery');
export const courierAddressBox = document.querySelector('.form-delivery__adress-box-courier');
export const pickupAddressBox = document.querySelector('.form-delivery__adress-box-pickup');


export const formatNumber = (number) => {
  const strNumber = number.toString();
  const parts = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts;
}

export const declenWords = (value, words) => {
	value = Math.abs(value) % 100;
	var num = value % 10;
	if (value > 10 && value < 20) return words[2];
	if (num > 1 && num < 5) return words[1];
	if (num == 1) return words[0];
	return words[2];
}

export const productWords = ['товар', 'товара', 'товаров']
