export class CardRequest {
    constructor(accessCode, action){
        this.accessCode = accessCode
        this.action = action;   // Type can be 'draw' or 'buzz'
    }
}