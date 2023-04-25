/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.rounds = null;
        this.roundTime = null;
        this.topic = null;
        Object.assign(this, data);
    }
}
export default Lobby;
