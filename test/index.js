const tressa = require('tressa');
const bide = require('../cjs');

tressa.title('bide(options).by(values)');

tressa.async(next => {
  const output = [];
  bide({
    next(value) {
      output.push(value);
    },
    done() {
      const expected = [1, 2, 3].join();
      tressa.assert(output.join() === expected, expected);
      next();
    }
  }).by(1, 2, 3);
})
.then(() => tressa.async(next => {
  const output = [];
  bide({
    next(value) {
      output.push(value);
    },
    done() {
      const expected = [1, 2, 3].join();
      tressa.assert(output.join() === expected, 'async ' + expected);
      next();
    }
  }).by(
    1,
    new Promise(res => {
      setTimeout(res, 10, 2);
    }),
    3
  );
}))
.then(() => tressa.async(next => {
  const output = [];
  bide({
    next(value) {
      if (value === 5)
        return new Promise(res => setTimeout(res, 10, 2));
      else
        output.push(value);
    },
    done() {
      const expected = [1, 2, 3].join();
      tressa.assert(output.join() === expected, 'swapped ' + expected);
      next();
    }
  }).by(
    1,
    5
  ).by(3);
}))
.then(() => tressa.async(next => {
  bide({
    next(value) {
      return Promise.reject(value);
    },
    done(err) {
      tressa.assert(err === 'failure', err);
      next();
    }
  }).by('failure');
}))
.then(() => tressa.async(next => {
  const bode = bide();
  tressa.assert(bode.state === 'initialized', 'status: initialized');
  bode.by(new Promise(res => setTimeout(res, 10, null)));
  tressa.assert(bode.state === 'pending', 'status: pending');
  setTimeout(() => {
    tressa.assert(bode.state === 'resolved', 'status: resolved');
    bode.by(new Promise((res, rej) => setTimeout(rej, 10, 'nope')));
    tressa.assert(bode.state === 'pending', 'status: pending x 2');
    process.on('unhandledRejection', (reason, p) => {
      tressa.assert(bode.state === 'rejected', 'status: rejected');
      tressa.assert(reason === 'nope', 'correct error');
      next();
    });
  }, 100);
}));
