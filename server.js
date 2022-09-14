const express = require('express')
const serverless = require('serverless-http')
const app = express()
// 6 MB is the maximum body size that AWS Lambda will accept for synchronous requests (https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
app.use(express.json({ limit: '6MB' }))
app.use(express.urlencoded({ extended: true }))
app.disable('x-powered-by')

app.use(function (req, res, next) {
  res.header('Server', 'Nhost')
  next()
})

let func
const requiredFile = require('./functions/test.js')
if (typeof requiredFile === 'function') {
  func = requiredFile
} else if (typeof requiredFile.default === 'function') {
  func = requiredFile.default
} else {
  return
}

app.all('*', func)

module.exports.handler = serverless(app)
