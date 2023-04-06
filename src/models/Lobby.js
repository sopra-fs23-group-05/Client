/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.accessCode = null;
        this.lobbyLeader = null;
        this.aSettings = null;
        Object.assign(this, data);
    }
}
export default Lobby;
