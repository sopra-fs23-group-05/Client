/**
 * Game model
 */
class GameModel {
    constructor(data = {}) {
        this.accessCode = null;
        this.settings = null;
        this.roundsPlayed = null;
        this.turn = null;
        this.team1 = null;
        this.team2 = null;
        this.leader = null;
        Object.assign(this, data);
    }
}

export default GameModel;
