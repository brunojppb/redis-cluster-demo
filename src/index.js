require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')
const buildRedisClient = require('./service/redisClient')

const app = express()
const port = process.env.PORT || 3000

const redis = buildRedisClient()

app.use(express.urlencoded({ extended: true }))

/** A rough debugging middleware */
app.use((req, resp, next) => {
  console.log(`${req.method} | URL=${req.url}`)
  return next()
})

/** handlebars template engine */
const VIEWS_PATH = `${__dirname}/views`
app.set('view engine', 'hbs')
app.set('views', VIEWS_PATH)
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: `${VIEWS_PATH}/layouts/`,
    partialsDir: `${VIEWS_PATH}/partials/`,
  })
)

app.use(
  '/static', express.static(path.join(__dirname, '/public'))
)

app.get('/', async (request, response) => {
  return response.render('home/index', {
    layout: 'default',
  })
})

app.post('/save-data', async (request, response) => {
  const { key, value } = request.body
  await redis.set(key, value)
  return response.status(201).render('home/index', {
    layout: 'default',
    dataSaved: true,
  })
})

app.post('/search', async (request, response) => {
  const { key } = request.body
  const value = await redis.get(key)
  return response.status(200).render('home/index', {
    layout: 'default',
    value,
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})