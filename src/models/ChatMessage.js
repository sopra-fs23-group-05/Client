export class ChatMessage {
    constructor(user, message, type){
        this.user = user;
        this.message = message;
        this.type = type;   // Type can be 'description' or 'guess'
    }
}