const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const cfgPath = path.resolve(__dirname, '../../.config.yml')

let config

module.exports = () => {
  if (!config) {
    const str = fs.readFileSync(cfgPath)
    config = yaml.safeLoad(str)
  }
  return config
}
