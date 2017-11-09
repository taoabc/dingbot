const winston = require('winston')
const fs = require('fs-extra')
const path = require('path')

const logdir = path.resolve(__dirname, '../../logs')
fs.ensureDirSync(logdir)

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
