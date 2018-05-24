class GroupDocument {

    constructor (color, name) {
        this.color = color;
        this.name = name;
    }

    getData(){
        return {
            color : this.color,
            name : this.name,
        }
    }
}

module.exports = GroupDocument;