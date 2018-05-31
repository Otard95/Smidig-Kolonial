class ProductDocument {

    constructor (kolonialId, amount = 1, groupId = undefined, docId = undefined) {
        this.kolonialId = kolonialId;
        this.amount = amount;
        this.groupId = groupId;
        this.dodumentId = docId;
    }

    getData(){
        let obj = {
            kolonialId : this.kolonialId,
            amount : this.amount
        };
        if (this.groupId) obj.groupId = this.groupId;
        return obj;
    }

}

module.exports = ProductDocument;