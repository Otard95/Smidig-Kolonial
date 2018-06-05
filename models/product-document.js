class ProductDocument {

    constructor (kolonialId, amount = 1, groupId = undefined, docId = undefined) {
        this.kolonialId = kolonialId;
        this.amount = amount;
        this.groupId = groupId;
        this.documentId = docId;
    }

    getData(){
        let obj = {};

        if (this.kolonialId) obj.kolonialId = this.kolonialId;
        if (this.amount) obj.amount = this.amount;
        if (this.groupId) obj.groupId = this.groupId;
        
        return obj;
    }

}

module.exports = ProductDocument;