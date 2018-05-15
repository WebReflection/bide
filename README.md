# bide [![Coverage Status](https://coveralls.io/repos/github/WebReflection/bide/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/bide?branch=master) [![Build Status](https://travis-ci.org/WebReflection/bide.svg?branch=master)](https://travis-ci.org/WebReflection/bide) [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A linear a/sync values solver

```js
const bode = bide({
  next(value) {
    if (value === 5)
      return new Promise(res => setTimeout(res, 50, 2));
    else
      console.log(value); // 1, 2, 3, 4
  },
  done(err) {
    if (err) throw err;
    console.log(bode.state); // resolved
  }
})
.by(
  1,
  5,  // will be replaced with the resolved value
  new Promise(res => setTimeout(res, 10, 3)),
  4
);
```
