// Load modules
const express = require('express');
const Big = require('big.js');

// Create server
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000

// Define server
app.get('/api/sir', (req, res) => {

  // Get parameters
  const t = Big(req.query.t)
  const sInit = Big(req.query.s)
  const iInit = Big(req.query.i)
  const rInit = Big(req.query.r)
  const n = Big(sInit.plus(iInit).plus(rInit))
  const beta = Big(req.query.b)
  const gamma = Big(req.query.g)

  let sir = []
  let sirCurrent = {}

  for (let j = 0; j < Number(t); j++ ) {
    if (j === 0) {
      // Initial values
      sirCurrent = {
        t: +j,
        s: +sInit,
        i: +iInit,
        r: +rInit,
      }
    } else {
      // Compute derivatives
      let sDelta = beta.times(-1).times(sir[j-1].s).times(+sir[j-1].i).div(n) 
      let iDelta = (beta.times(sir[j-1].s).times(+sir[j-1].i).div(n)).minus(gamma.times(+sir[j-1].i))
      let rDelta = gamma.times(+sir[j-1].i)
      // Compute current SIR
      let sCurrent = +sir[j-1].s + +sDelta
      let iCurrent = +sir[j-1].i + +iDelta
      let rCurrent = +sir[j-1].r + +rDelta
      // Append current SIR to SIR array
      sirCurrent = {
        t: j,
        s: sCurrent,
        i: iCurrent,
        r: rCurrent,
      }
    }
    sir.push(sirCurrent)
  }

  // Round to two decimal places
  let sirRounded = sir.map(a => {
    return {
      t: +a.t.toFixed(2),
      s: +a.s.toFixed(2),
      i: +a.i.toFixed(2),
      r: +a.r.toFixed(2),
    }
  })
  res.json(sirRounded);
})

// Listen to PORT
app.listen(PORT, () => console.log(`Server Running on ${PORT}`))