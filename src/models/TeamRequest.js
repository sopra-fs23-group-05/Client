export class TeamRequest {
    constructor(accessCode, teamNr, userId, type) {
        this.accessCode = accessCode
        this.teamNr = teamNr
        this.userId = userId
        this.type = type    // Type can be 'addition' or 'removal'
    }
}