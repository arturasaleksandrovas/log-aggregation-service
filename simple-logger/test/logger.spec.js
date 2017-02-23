import chai from 'chai';
import {expect} from 'chai';
import sinon from 'sinon';
import logger from '../src/logger';
import output from '../src/output';

let outputMock;

describe('Logger messages logging', () => {
    beforeEach(() => {
        outputMock = sinon.mock(output);
    });

    afterEach(function() {
        outputMock.verify();
        outputMock.restore();
    });

    it('should test if correct logging is done for info severity level', () => {
        outputMock.expects('log').withArgs('info: test message').once().returns(null);

        logger.info('test message');
    });

    it('should test if correct logging is done for warning severity level', () => {
        outputMock.expects('log').withArgs('warning: test message 2').once().returns(null);

        logger.warning('test message 2');

    });

    it('should test if correct logging is done for error severity level', () => {
        outputMock.expects('log').withArgs('error: test message 3').once().returns(null);

        logger.error('test message 3');
    });
});