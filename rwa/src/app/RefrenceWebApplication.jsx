import React from 'react';
import _ from 'lodash';
import logger from '../../../simple-logger/logger';
import requestify from 'requestify';

const API_URL = 'http://localhost:5000';
const LOG_URL = API_URL + '/api/log';
const GET_MESSAGES_URL = API_URL + '/api/get-messages';
const GET_FREQUENCIES_URL = API_URL + '/api/get-frequencies';

class RefrenceWebApplication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            level: 'info',
            recentMessages: [],
            frequencies: [],
            refreshDataTimer: 10
        };

        this.getRecentMessages = this.getRecentMessages.bind(this);
        this.getMessageFrequencies = this.getMessageFrequencies.bind(this);
        this.updateData = this.updateData.bind(this);

        this.updateData();

        setInterval(() => {
            let refreshDataTimer = this.state.refreshDataTimer;

            if (!refreshDataTimer) {
                this.updateData();
            }

            this.setState({refreshDataTimer: refreshDataTimer ? --refreshDataTimer : 10});
        }, 1000);
    }

    onInputChange(e) {
        this.state[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    logMessage(message, level) {
        logger.log(level, message);

        requestify.post(LOG_URL, {
            timestamp: new Date().getTime(),
            message: message,
            level: level
        });
    }

    onSubmitLogMessage(e) {
        e.preventDefault();

        this.logMessage(this.state.message, this.state.level);

        this.setState({message: '', level: this.state.level});
    }

    getRecentMessages() {
        requestify.get(GET_MESSAGES_URL).then((response) => {
            const recentMessages = response.getBody();

            this.setState({recentMessages});
        });
    }

    getMessageFrequencies() {
        requestify.get(GET_FREQUENCIES_URL).then((response) => {
            let frequencies = response.getBody();

            this.setState({frequencies});
        });
    }

    updateData() {
        this.getRecentMessages();
        this.getMessageFrequencies();
    }

    render() {

        const recentMessages = _.map(this.state.recentMessages, (message) => {
            return (
                <div key={message.timestamp}>
                    <p>{message.timestamp} {message.level}: {message.message}</p>
                </div>
            );
        });

        const frequencies = _.map(this.state.frequencies, (frequency) => {
            return (
                <div key={frequency.level}>
                    <p>{frequency.level} - {frequency.frequency}</p>
                </div>
            );
        });

        return (
            <div>
                <h2>Log message</h2>
                <form onSubmit={this.onSubmitLogMessage.bind(this)}>
                    <label>Message value:</label><input name="message" onChange={this.onInputChange.bind(this)} value={this.state.message} type="text" />
                    <label>Level:</label>
                    <select name="level" onChange={this.onInputChange.bind(this)} value={this.state.level}>
                        <option value="info">info</option>
                        <option value="warning">warning</option>
                        <option value="error">error</option>
                    </select>
                    <input type="submit" value="Submit" />
                </form>

                <div><button onClick={this.updateData} disabled={!this.state.refreshDataTimer}>Refresh ({this.state.refreshDataTimer})</button></div>
                <div>
                    <h2>Recent log messages</h2>
                    <div>
                        {recentMessages}
                    </div>
                    <h2>Log message frequencies by severity level</h2>
                    <div>
                        {frequencies}
                    </div>
                </div>
            </div>
        );
    }

}

export default RefrenceWebApplication;