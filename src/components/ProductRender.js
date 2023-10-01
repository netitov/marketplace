export default class ProductRender {
  constructor ({ items, renderer }, containerSelector) {
    this._renderedItems = items;
    this._renderer = renderer;
    this._container = containerSelector;
    this.addItem = this.addItem.bind(this);
  }

  renderItems() {
    const items = this._renderedItems.reverse();

    items.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }

}
