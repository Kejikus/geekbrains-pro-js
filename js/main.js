const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class Good {
    id;
    product_name;
    price;
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
        itemList.push(new Item(good.product_name, good.price, ""))
    }

    return itemList;
}

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: ''
    },
    methods: {
        makeGETRequest(url) {
            return makeGETRequest(url);
        }
    },
    mounted() {
        this.makeGETRequest(`${API_URL}/catalogData.json`)
            .then((goods) => {
                console.log(JSON.parse(goods));
                this.goods = makeItems(JSON.parse(goods));
                this.filteredGoods = this.goods;
            });
    }
});