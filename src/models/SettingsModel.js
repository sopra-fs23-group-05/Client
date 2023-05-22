/**
 * Lobby model
 */
class SettingsModel {
    constructor(data = {}) {
        this.rounds = null;
        this.roundTime = null;
        this.topic = null;
        Object.assign(this, data);
    }
}

export default SettingsModel;
