const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const AWS = require('aws-sdk')

const router = require('./routes')

const ENV = process.env.NODE_ENV || "dev"

const config = dotenv.config({
  path: `./configs/${ENV}.env`
}).parsed


AWS.config = new AWS.Config()
AWS.config.accessKeyId = config.AWS_KEY_ID
AWS.config.secretAccessKey = config.AWS_SECRET_KEY
AWS.config.region = config.AWS_REGION

const s3 = new AWS.S3({apiVersion: '2006-03-01'})

const app = express()

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected successfully to database')
  })

const db = require('./models')

app.use((req, res, next) => {
  req.db = db
  req.config = config
  req.s3 = s3
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

app.listen(config.PORT, () =>
  console.log(`Listening on port ${config.PORT}...`)
)

