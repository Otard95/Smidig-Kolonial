class ShoppingListDocument {

    constructor (name, date, products = [], groups = [], sharedWith = []) {
        this.date = date;
        this.name = name;
        this.products = products;
        this.groups = groups;
        this.sharedWith = sharedWith;
    }

    getData () {
        let obj = {
            date : this.date,
            name : this.name
        };

        if (this.products) obj.products = this.products;
        if (this.groups) obj.groups = this.groups;
        if (this.sharedWith) obj.sharedWith = this.sharedWith;
        
        return obj;
    }

}

module.exports = ShoppingListDocument;