import output from './output'; //used only for better mocking in tests

class Logger {
    constructor() {
        this.levels = ['info', 'error', 'warning'];
    }

    info(message) {
        this.log('info', message);
    }

    error(message) {
        this.log('error', message);
    }

    warning(message) {
        this.log('warning', message);
    }

    log(level, message) {
        if (this.levels.indexOf(level) === -1) {
            return;
        }

        output.log(level + ': ' + message)
    }
}

export default new Logger();