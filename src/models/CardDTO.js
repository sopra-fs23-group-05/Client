/**
 * CardDTO model
 */
class CardDTO {
    constructor(data = {}) {
        this.word = null;
        this.taboo1 = null;
        this.taboo2 = null;
        this.taboo3 = null;
        this.taboo4 = null;
        this.taboo5 = null;
        this.turnPoints = null;
        Object.assign(this, data);
    }
}

export default CardDTO;