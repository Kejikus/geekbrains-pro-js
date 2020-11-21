'use strict'

class Cart {
    constructor() {
        this.entries = [];
    }

    addItem(item) {
        this.entries.add(item);
    }
}

class CartEntry {
    /**
     * @param {Item} item
     * @param {number} quantity
     */
    constructor(item, quantity) {
        this._item = item;
        this._quantity = quantity;
    }
}

class Item {
    /**
     * @param {string} name
     * @param {number} price
     * @param {string} description
     */
    constructor(name, price, description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

/**
 * Find sum price of several cart entries
 * @param {CartEntry[]} items
 */
function cartSum(items) {
    let sum = 0;

    for (let item in items) {
        sum += item._item.price;
    }

    return sum;
}
