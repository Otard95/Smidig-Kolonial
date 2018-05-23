class ShoppingListDocument {

    constructor (name, date) {
        this.date = date;
        this.name = name;
    }

    getData(){
        return {
            date : this.date,
            name : this.name
        }
    }

}

module.exports = ShoppingListDocument;