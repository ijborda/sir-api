// Load modules
const express = require('express');
const Big = require('big.js');
const cors = require('cors');

// Create server
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 9000;

// Middlewares
app.use(express.static('public'));
app.use(cors());

// Welcome page
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// API
app.get('/api/sir', (req, res) => {
  // Get parameters
  const t = Big(req.query.t);
  const sInit = Big(req.query.s);
  const iInit = Big(req.query.i);
  const rInit = Big(req.query.r);
  const n = Big(sInit.plus(iInit).plus(rInit));
  const beta = Big(req.query.b);
  const gamma = Big(req.query.g);

  const sir = {
    t: [],
    s: [],
    i: [],
    r: [],
  };
  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < Number(t); j++) {
    if (j === 0) {
      // Initial values
      sir.t.push(+j);
      sir.s.push(+sInit);
      sir.i.push(+iInit);
      sir.r.push(+rInit);
    } else {
      // Compute derivatives
      const sDelta = beta.times(-1).times(sir.s[j - 1]).times(+sir.i[j - 1]).div(n);
      const iDelta = sDelta.times(-1).minus(gamma.times(+sir.i[j - 1]));
      const rDelta = gamma.times(+sir.i[j - 1]);
      // Compute current SIR
      const sCurrent = +sir.s[j - 1] + +sDelta;
      const iCurrent = +sir.i[j - 1] + +iDelta;
      const rCurrent = +sir.r[j - 1] + +rDelta;
      // Append current SIR to SIR array
      sir.t.push(j);
      sir.s.push(sCurrent);
      sir.i.push(iCurrent);
      sir.r.push(rCurrent);
    }
  }

  // Round to two decimal places
  const sirRounded = {
    t: sir.t.map((a) => +a.toFixed(2)),
    s: sir.s.map((a) => +a.toFixed(2)),
    i: sir.i.map((a) => +a.toFixed(2)),
    r: sir.r.map((a) => +a.toFixed(2)),
  };
  res.json(sirRounded);
});

// Listen to PORT
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
