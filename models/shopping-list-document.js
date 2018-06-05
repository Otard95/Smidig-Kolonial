class ShoppingListDocument {

    constructor (name, date, products = [], groups = [], sharedWith = [], id = undefined) {
        this.date = date;
        this.name = name;
        this.products = products;
        this.groups = groups;
        this.sharedWith = sharedWith;
        this.documentId = id
    }

    getData () {
        let obj = {
            date : this.date,
            name : this.name
        };
        
        if (this.sharedWith) obj.sharedWith = this.sharedWith;
        
        return obj;
    }

}

module.exports = ShoppingListDocument;