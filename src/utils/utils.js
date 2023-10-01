export const productsContainer = document.querySelector('.products__list');

export const formatNumber = (number) => {
  const strNumber = number.toString();
  const parts = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts;
}
