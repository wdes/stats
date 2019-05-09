'use strict';

const stack = require('@lib/stack');
const expect = require('chai').expect;
const sinon = require('sinon');

module.exports = function() {
    suite('stack timers scheduler calls', function() {
        var timers = null;
        var spy = null;
        var stackTest = null;
        setup(function() {
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

        teardown(function() {
            stackTest.stop();
            sinon.restore();
        });
    });

    suite('stack timers', function() {
        var stackTest = null;
        setup(function() {
            stackTest = stack();
            stackTest.init(30, () => {}, () => {});
        });

        test('add to stack', done => {
            expect(stackTest.getTasks()).to.deep.equal([]);
            stackTest.addToStack('Test message');
            expect(stackTest.getTasks()).to.deep.equal(['Test message']);
            expect(stackTest.getMaxLength()).to.equal(30);
            done();
        });

        test('Test to group messages', done => {
            var spy = sinon.spy();
            var spyTimer = sinon.spy();
            var timers = sinon.useFakeTimers({
                now: new Date().getTime(),
                shouldAdvanceTime: true,
            });
            stackTest = stack();
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
            var spy = sinon.spy();
            var spyTimer = sinon.spy();
            var timers = sinon.useFakeTimers({
                now: new Date().getTime(),
                shouldAdvanceTime: true,
            });
            stackTest = stack();
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
            stackTest.getCronTask().start();
            done();
        });

        teardown(function() {
            stackTest.stop();
            sinon.restore();
        });
    });
};
