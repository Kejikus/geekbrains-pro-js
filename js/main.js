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


Vue.component('item-list', {
    props: {
        items: Array
    },
    template: `
        <div class="item-container">
            <shop-item v-for="item in items" :item="item"></shop-item>
        </div>
    `
});

Vue.component('shop-item', {
    props: {
        item: Item
    },
    template: `
        <div class="shop-item">
            <div class="shop-item__image">
                <img src="https://via.placeholder.com/160x120" alt="">
            </div>
            <div class="shop-item__name">{{ item.name }}</div>
            <div class="shop-item__price">\${{ item.price }}</div>
            <div class="shop-item__buttons">
                <button class="shop-item__add-button">Добавить</button>
            </div>
        </div>
    `
});

Vue.component('search-line', {
    data: () => ({
        searchLine: ""
    }),
    template: `
        <div>
            <input type="search" v-model="searchLine">
            <input type="submit" value="Искать" v-on:click="$emit('search', searchLine)">
        </div>
    `
});

Vue.component('cart', {
    data: () => ({
        isVisible: false,
        cart: new Cart(),
    }),
    methods: {
        showHideCart() {
            this.isVisible = !this.isVisible;
        }
    },
    computed: {
        isCartEmpty() {
            return this.cart.entries.length === 0;
        }
    },
    template: `
        <div class="cart">
            <button class="cart__cart-btn" @click="showHideCart">Корзина</button>
            <div class="cart__dropdown" v-if="isVisible">
                <strong v-if="isCartEmpty">Cart is empty</strong>
                <ul class="cart__items-list" v-if="!isCartEmpty">
                    <li class="cart-item" v-for="entry in cart.entries">
                        <div class="cart-item__name">{{ entry.item.name }}</div>
                        <div class="cart-item__count">{{ entry.quantity }}</div>
                        <div class="cart-item__total-price">\${{ entry.item.price * entry.quantity }}</div>
                    </li>
                </ul>
                <button class="cart__clear-btn" v-if="!isCartEmpty">Очистить</button>
            </div>
        </div>
    `
});


const app = new Vue({
    el: '#app',
    data: {
        items: [],
        filteredItems: [],
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
                this.items = makeItems(JSON.parse(goodsTxt));
                this.filteredItems = this.items;
            });
    }
});