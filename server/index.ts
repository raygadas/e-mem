import express from 'express'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/signin', function (req, res) {
    return app.render(req, res, '/signin', req.query)
  })

  server.get('/entry/:experience_id', (req, res) => {
    return app.render(req, res, '/entry', { id: req.params.experience_id, ...req.query })
  })

  server.get('/subject/:id_subject/category/:category_id', function (req, res) {
    return app.render(req, res, '/category', { id: req.params.category_id, id_subject: req.params.id_subject, ...req.query })
  });

  server.get('/', function (req, res) {
    return app.render(req, res, '/', req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})