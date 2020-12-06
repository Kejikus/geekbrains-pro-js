const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

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

    get itemList() {
        return this._entries.map(value => value.item);
    }

    get entries() {return this._entries;}

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

class Good {
    id;
    product_name;
    price;
}

class Item {
    /**
     * Construct Item
     *
     * @param {number} id Id of the product
     * @param {string} name Name of the product
     * @param {number} price Price of the product
     * @param {string} description Short description of the product
     */
    constructor(id, name, price= 0, description= "") {
        this._id = id;
        this._name = name;
        this._price = price;
    }

    get id() {return this._id;}
    get price() {return this._price;}
    get name() {return this._name;}
}

class ItemList {
    /**
     * @param {Item[]} items
     */
    constructor(items = []) {
        this._items = items;
    }

    get items() {return this._items;}
    set items(value) {this._items = value;}

    fetchItemList() {
        makeGETRequest(`${API_URL}/catalogData.json`)
            .then((response) => {
                if (typeof response === "string") {
                    let res = JSON.parse(response);
                    if (Array.isArray(res)) {
                        for (let i = 0; i < res.length; i++) {
                            this._items.push(new Item(res[i].price, res[i].product_name));
                        }
                    }
                }
            });
    }
}

function makeGETRequest(url) {
    let xhr;

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    return new Promise(
        ((resolve, reject) => {
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                }
                else {
                    reject("Request error")
                }

            }

            xhr.onerror = function () {
                reject("Request failed")
            }

            xhr.open('GET', url, true);
            xhr.send();
        })
    );
}

/**
 * @param {Good[]} goods
 */
function makeItems(goods) {
    let itemList = [];
    /** @type {Good} good */
    for (let good of goods) {
        console.log(good);
        itemList.push(new Item(good.id, good.product_name, good.price, ""))
    }

    return itemList;
}

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        isVisibleCart: false,
        cart: new Cart(),
    },
    methods: {
        makeGETRequest(url) {
            return makeGETRequest(url);
        },
        filterGoods(text) {
            console.log(text);
            /* Фильтруем */
        },
        showHideCart() {
            this.isVisibleCart = !this.isVisibleCart;
        }
    },
    mounted() {
        this.makeGETRequest(`${API_URL}/catalogData.json`)
            .then((goodsTxt) => {
                this.goods = makeItems(JSON.parse(goodsTxt));
                this.filteredGoods = this.goods;
                this.cart.addItem(this.goods[0]);
                this.cart.addItem(this.goods[0]);
                this.cart.addItem(this.goods[1]);
            });
    }
});