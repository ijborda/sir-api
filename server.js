// Load modules
const express = require('express');
const Big = require('big.js');

// Create server
const app = express();
const PORT = process.env.PORT || 8000

// Define server
app.get('/api/sir', (req, res) => {

  // Get parameters
  const t = Big(req.query.t)
  const s = Big(req.query.s)
  const i = Big(req.query.i)
  const r = Big(req.query.r)
  const n = Big(s.plus(i).plus(r))
  const beta = Big(req.query.b)
  const gamma = Big(req.query.g)

  let sir = []

  for (let j = 0; j < Number(t); j++ ) {
    let sirT = { }
    if (j === 0) {
      sirT = {
        t: +j,
        s: +s,
        i: +i,
        r: +r,
      }
    } else {
      let sDelta = beta.times(-1).times(sir[j-1].s).times(+sir[j-1].i).div(n) 
      let iDelta = (beta.times(sir[j-1].s).times(+sir[j-1].i).div(n)).minus(gamma.times(+sir[j-1].i))
      let rDelta = gamma.times(+sir[j-1].i)
      console.log(+sir[j-1].s, +sir[j-1].i, +sir[j-1].r)
      let sCurrent = +sir[j-1].s + +sDelta
      let iCurrent = +sir[j-1].i + +iDelta
      let rCurrent = +sir[j-1].r + +rDelta
      sirT = {
        t: j,
        s: sCurrent,
        i: iCurrent,
        r: rCurrent,
      }
    }
    sir.push(sirT)
  }
  sir = sir.map(a => {
    return {
      t: +a.t.toFixed(2),
      s: +a.s.toFixed(2),
      i: +a.i.toFixed(2),
      r: +a.r.toFixed(2),
    }
  })
  res.json(sir);
})

// Listen to PORT
app.listen(PORT, () => console.log(`Server Running on ${PORT}`))