'use strict';

import stack from '@lib/stack';
import { expect } from 'chai';
import * as sinon from 'sinon';

export default () => {
    suite('stack timers scheduler calls', () => {
        let timers: sinon.SinonFakeTimers;
        let spy: sinon.SinonSpy<any[], any>;
        let stackTest;
        setup(() => {
            timers = sinon.useFakeTimers({
                now: new Date().getTime(),
                shouldAdvanceTime: true,
            });
            spy = sinon.spy();
            stackTest = stack();
            stackTest.init(
                30,
                () => {
                    spy();
                },
                () => {}
            );
        });

        test('cb calls each half second', done => {
            timers.tick('01:00');
            expect(spy.callCount).to.equal(2);
            done();
        });

        test('cb calls each half second on more time', done => {
            timers.tick('04:00');
            expect(spy.callCount).to.equal(8);
            done();
        });

        test('cb calls each half second on some hours', done => {
            timers.tick('01:00:00');
            expect(spy.callCount).to.equal(120);
            done();
        });

        teardown(() => {
            timers.restore();
            stackTest.stop();
            sinon.restore();
        });
    });

    suite('stack timers', () => {
        let timers: sinon.SinonFakeTimers;

        setup(() => {
            timers = sinon.useFakeTimers({
                now: new Date().getTime(),
                shouldAdvanceTime: true,
            });
        });

        test('add to stack', done => {
            const stackTest = stack();
            stackTest.init(30, () => {}, () => {});
            expect(stackTest.getTasks()).to.deep.equal([]);
            stackTest.addToStack('Test message');
            expect(stackTest.getTasks()).to.deep.equal(['Test message']);
            expect(stackTest.getMaxLength()).to.equal(30);
            done();
        });

        test('Test to group messages', done => {
            const spy = sinon.spy();
            const spyTimer = sinon.spy();
            const stackTest = stack();
            stackTest.init(
                30,
                () => {
                    spyTimer();
                },
                taskMessage => {
                    spy(taskMessage);
                }
            );

            stackTest.addToStack('Test message\nzd\nza\n');
            stackTest.addToStack('random\ndata\n');
            stackTest.addToStack('Èval\n^ëçç\nza\nsde\n');
            stackTest.addToStack('ab');
            expect(stackTest.getTasks()).to.deep.equal([
                'Test message\nzd\nza\n',
                'random\ndata\n',
                'Èval\n^ëçç\nza\nsde\n',
                'ab',
            ]);
            timers.tick('01:00');
            sinon.assert.calledTwice(spyTimer);
            expect(spyTimer.getCalls()[0].args).to.deep.equal([]);
            expect(spy.getCalls()[0].args).to.deep.equal([
                ['Test message\nzd\nza\n\n--\nrandom\n', 'data\n\n--\nÈval\n^ëçç\nza\nsde\n\n--\n', 'ab'],
            ]);
            spy.getCalls()[0].args[0].forEach(arg => {
                expect(arg.length).to.be.below(31);
            });
            expect(spy.getCalls()[1].args).to.deep.equal([[]]);
            done();
        });

        test('Test to group messages (dataset: 2)', done => {
            const spy = sinon.spy();
            const spyTimer = sinon.spy();
            const stackTest = stack();
            stackTest.init(
                100,
                () => {
                    spyTimer();
                },
                taskMessage => {
                    spy(taskMessage);
                }
            );
            stackTest.addToStack('[Stats] A message for you, server: x is now down.\nAt 01:01:00 YYYY-MM-DD\nBye.');
            stackTest.addToStack('[Stats] A message for you, server: x is now up.\nAt 01:02:00 YYYY-MM-DD\nBye.');
            stackTest.addToStack('[Stats] Just a ping.');
            stackTest.addToStack('[Stats] Just a pong.');
            expect(stackTest.getTasks()).to.deep.equal([
                '[Stats] A message for you, server: x is now down.\nAt 01:01:00 YYYY-MM-DD\nBye.',
                '[Stats] A message for you, server: x is now up.\nAt 01:02:00 YYYY-MM-DD\nBye.',
                '[Stats] Just a ping.',
                '[Stats] Just a pong.',
            ]);
            timers.tick('01:00');
            sinon.assert.calledTwice(spyTimer);
            expect(spyTimer.getCalls()[0].args).to.deep.equal([]);
            expect(spy.getCalls()[0].args).to.deep.equal([
                [
                    '[Stats] A message for you, server: x is now down.\nAt 01:01:00 YYYY-MM-DD\nBye.\n--\n[Stats] A message f',
                    'or you, server: x is now up.\nAt 01:02:00 YYYY-MM-DD\nBye.\n--\n[Stats] Just a ping.\n--\n[Stats] Just a p',
                    'ong.',
                ],
            ]);
            spy.getCalls()[0].args[0].forEach(arg => {
                expect(arg.length).to.be.below(101);
            });
            expect(spy.getCalls()[1].args).to.deep.equal([[]]);
            done();
        });

        test('cron task getter', done => {
            const stackTest = stack();
            stackTest.init(100, () => {}, taskMessage => {});
            stackTest.getCronTask().start();
            done();
        });

        teardown(() => {
            timers.restore();
            sinon.restore();
        });
    });
};
