const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 3000

const renderHandler = require('./render-handler')


const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dir: '.',
  dev
})

const handle = app.getRequestHandler()

process.on('uncaughtException', function (err) {
  console.log('Uncaught Exception: ' + err)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

app.prepare()
  .then(() => {
    const server = express()

    server.use(bodyParser.json())
    server.use(express.static('static'))

    server.post('/render', renderHandler)

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.log('Error occured, unable to start')
    console.log(err)
  })