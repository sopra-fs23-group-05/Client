/**
 * User model
 */
class User {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.token = null;
        this.status = null;
        this.leader = null;
        this.teamId = null;
        Object.assign(this, data);
    }
}

export default User;
