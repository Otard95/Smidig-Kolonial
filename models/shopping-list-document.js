class ShoppingListDocument {

    constructor (name, date, products = [], groups = []) {
        this.date = date;
        this.name = name;
        this.products = products;
        this.groups = groups;
    }

    getData(){
        return {
            date : this.date,
            name : this.name
        }
    }

}

module.exports = ShoppingListDocument;