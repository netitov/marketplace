export const productsContainer = document.querySelector('.products__list');
export const missingProductsContainer = document.querySelector('.products__list_missing');

export const formatNumber = (number) => {
  const strNumber = number.toString();
  const parts = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts;
}
