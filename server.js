// Load modules
const express = require('express');
const Big = require('big.js');

// Create server
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000;

// Define server
app.get('/api/sir', (req, res) => {
  // Get parameters
  const t = Big(req.query.t);
  const sInit = Big(req.query.s);
  const iInit = Big(req.query.i);
  const rInit = Big(req.query.r);
  const n = Big(sInit.plus(iInit).plus(rInit));
  const beta = Big(req.query.b);
  const gamma = Big(req.query.g);

  const sir = [];
  let sirCurrent = {};

  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < Number(t); j++) {
    if (j === 0) {
      // Initial values
      sirCurrent = {
        t: +j,
        s: +sInit,
        i: +iInit,
        r: +rInit,
      };
    } else {
      // Compute derivatives
      const sDelta = beta.times(-1).times(sir[j - 1].s).times(+sir[j - 1].i).div(n);
      const iDelta = sDelta.times(-1).minus(gamma.times(+sir[j - 1].i));
      const rDelta = gamma.times(+sir[j - 1].i);
      // Compute current SIR
      const sCurrent = +sir[j - 1].s + +sDelta;
      const iCurrent = +sir[j - 1].i + +iDelta;
      const rCurrent = +sir[j - 1].r + +rDelta;
      // Append current SIR to SIR array
      sirCurrent = {
        t: j,
        s: sCurrent,
        i: iCurrent,
        r: rCurrent,
      };
    }
    sir.push(sirCurrent);
  }

  // Round to two decimal places
  const sirRounded = sir.map((a) => {
    const round = {
      t: +a.t.toFixed(2),
      s: +a.s.toFixed(2),
      i: +a.i.toFixed(2),
      r: +a.r.toFixed(2),
    };
    return round;
  });
  res.json(sirRounded);
});

// Listen to PORT
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
