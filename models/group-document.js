class GroupDocument {

    constructor (color, name, docId = undefined) {
        this.color = color;
        this.name = name;
        this.documentId = docId;
    }

    getData(){
        return {
            color : this.color,
            name : this.name,
        }
    }
}

module.exports = GroupDocument;