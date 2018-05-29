class ProductDocument {

    constructor (kolonialId, amount = 1, groupId = undefined) {
        this.kolonialId = kolonialId;
        this.amount = amount;
        this.groupId = groupId;
    }

    getData(){
        return {
            kolonialId : this.kolonialId,
            amount : this.amount,
            groupId : this.groupId
        }
    }

}

module.exports = ProductDocument;