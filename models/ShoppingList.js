class ShoppingList {

    constructor (date, name, groups, products, ...id) {
        this.date = date;
        this.name = name;
        this.groups = groups;
        this.products = products;
        this.id = id;
    }

}

module.exports = ShoppingList;