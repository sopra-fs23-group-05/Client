/**
 * Team model
 */
class Team {
    constructor(data = {}) {
        this.id = null;
        this.teamName = null;
        this.players = null;
        this.points = null;
        this.aRole = null;
        this.idxClueGiver = null;
        Object.assign(this, data);
    }

    getClueGiver() {
        return this.players[this.idxClueGiver];
    }

    getTeamRole() {
        return this.aRole.toString().toLowerCase();
    }
}
export default Team;
