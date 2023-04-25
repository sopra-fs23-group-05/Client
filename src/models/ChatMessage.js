export class ChatMessage {
    constructor(accessCode, userId, message, type){
        this.accessCode = accessCode
        this.userId = userId;
        this.message = message;
        this.type = type;   // Type can be 'description' or 'guess'
    }
}