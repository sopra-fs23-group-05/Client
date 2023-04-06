/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.accessCode = null;
        this.lobbyLeader = null;
        this.aSettings = null;
        this.lobbyUsers = null;
        this.team1 = null;
        this.team2 = null;
        Object.assign(this, data);
    }
}
export default Lobby;
