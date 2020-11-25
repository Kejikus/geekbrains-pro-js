'use strict'

class Cart {
    /**
     * Construct Cart object
     *
     * @param {CartEntry[]} entries
     */
    constructor(entries = []) {
        this._entries = entries;
    }

    /**
     * Add item to the cart
     * @param {Item} item
     */
    addItem(item) {
        let idx = this._entries.findIndex(value => value.item === item);
        if (idx > -1) {
            this._entries[idx].quantity++;
        }
        else {
            let newItem = new CartEntry(item);
            newItem.setDeleteCallback(() => this.removeItem(item));
            this._entries.push(newItem);
        }
    }

    removeItem(itemOrIndex) {
        if (typeof itemOrIndex == 'number') {
            this._entries.splice(itemOrIndex);
        }
        else {
            let idx = this._entries.findIndex(value => value.item === itemOrIndex);
            if (idx !== -1)
                this._entries.splice(idx);
        }
    }

    clearCart() {
        /* Показать диалог с подтверждением и удалить после нажатия "Да" */

        for (let i = 0; i < this._entries.length; i++)
            this._entries[i].resetDeleteCallback();

        this._entries = [];
    }

    get sum() {
        return cartSum(this._entries);
    }

    submitOrder() {
        /* Перенаправление на страницу оформления заказа */
    }
}

class CartEntry {
    /**
     * @param {Item} item
     * @param {number} quantity
     */
    constructor(item, quantity = 1) {
        this._item = item;
        this._quantity = quantity;
        this._deleteCallback = null;
    }

    get item() {return this._item;}

    get quantity() {return this._quantity;}

    set quantity(value) {
        if (value < 1)
            this._quantity = 1;
        else
            this._quantity = value;
    }

    addOne() {
        this._quantity++;
    }

    removeOne() {
        if (this._quantity > 1)
            this._quantity--;
        else
            throw new Error("Quantity of item cannot be less than 1.")
    }

    deleteFromCart() {
        if (this._deleteCallback != null)
            setTimeout(
                this._deleteCallback,
                0
            );
        this._deleteCallback = null;
    }

    setDeleteCallback(callback) {
        this._deleteCallback = callback;
    }

    resetDeleteCallback() {this._deleteCallback = null;}
}

class Item {
    /**
     * Construct Item
     *
     * @param {string} name Name of the product
     * @param {number} price Price of the product
     * @param {string} description Short description of the product
     */
    constructor(name, price= 0, description= "") {
        this._name = name;
        this._price = price;
        this._description = description;
    }

    get price() {return this._price;}
    get name() {return this._name;}
    get description() {return this._description;}
}

/**
 * Find sum price of several cart entries
 *
 * @param {CartEntry[]} items Collection of items in the cart
 */
function cartSum(items) {
    let sum = 0;

    for (let i = 0; i < items.length; i++) {
        sum += items[i].item.price;
    }

    return sum;
}
