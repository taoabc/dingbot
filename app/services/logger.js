const winston = require('winston')
const fs = require('fs-extra')
const path = require('path')

const logdir = path.resolve(__dirname, '../../logs')
fs.ensureDirSync(logdir)

function createFileTransport (dir, filename, level) {
  const filepath = path.resolve(dir, filename)
  const opt = {
    filename: filepath
    // maxsize: 2000,
    // maxFiles: 5,
    // zippedArchive: true
  }
  if (level) {
    opt.level = level
  }
  return new winston.transports.File(opt)
}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    createFileTransport(logdir, 'error.log', 'error'),
    createFileTransport(logdir, 'combined.log')
  ],
  exceptionHandlers: [
    createFileTransport(logdir, 'exceptions.log')
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
