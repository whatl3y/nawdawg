"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const assert_1 = __importDefault(require("assert"));
function nawdawg(opts) {
    return async function (req, _, next) {
        try {
            if (typeof opts === 'number') {
                await sleep(opts);
                return next();
            }
            opts = opts || {};
            opts.delay = opts.delay || 100;
            opts.delayer = opts.delayer || NOOP;
            assert_1.default(typeof opts.delay === 'number', `opts.delay should be a number of milliseconds to delay request`);
            assert_1.default(typeof opts.delayer === 'function', `opts.delayer must be a function`);
            const isAsync = opts.delayer.constructor.name === 'AsyncFunction';
            let delayerResult;
            if (isAsync) {
                delayerResult = await opts.delayer(req);
            }
            else {
                delayerResult = opts.delayer(req);
            }
            assert_1.default(['boolean', 'number'].includes(typeof delayerResult), `result of delayer should be a boolean or number`);
            if (typeof delayerResult === 'number') {
                await sleep(delayerResult);
            }
            else if (delayerResult) {
                await sleep(opts.delay);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.default = nawdawg;
function NOOP() {
    return true;
}
async function sleep(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
