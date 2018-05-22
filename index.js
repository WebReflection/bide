/*!
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
var bide = (function () {'use strict';
  function done(err) { if (arguments.length) throw err; }
  function isPromise(value) { return value != null && typeof value.then === 'function'; }
  function unshiftThen(queue, value, resolve) {
    if (isPromise(value)) queue.unshift(value);
    resolve();
  }

  return function (options) { if (!options) options = {};
    var after = options.done || done;
    var next = options.next || function (value) { return value; };
    var queue = [];
    var status = 'initialized';
    return {
      get state() { return status; },
      by: function () {
        queue.push.apply(queue, arguments);
        if (status !== 'pending') {
          status = 'pending';
          (function resolve() {
            if (queue.length) {
              const result = queue.shift();
              if (isPromise(result)) {
                result.then(
                  function (value) {
                    unshiftThen(queue, next.call(options, value), resolve);
                  },
                  function (error) {
                    queue.splice(0);
                    status = 'rejected';
                    after.call(options, error);
                  }
                );
              } else
                unshiftThen(queue, next.call(options, result), resolve);
            } else {
              status = 'resolved';
              after.call(options);
            }
          }());
        }
        return this;
      }
    };
  };
}());
