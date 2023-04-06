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
}
export default Team;
