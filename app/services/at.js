const _ = require('lodash')
const atTable = require('../../at-table')

function mobilesFromAuthor (authorName, authorEmail) {
  let finded
  if (authorEmail) {
    finded = _.find(atTable, { authorEmail })
  }
  if (!finded && authorName) {
    finded = _.find(atTable, { authorName })
  }
  if (finded) {
    return [ finded.phone ]
  }
  return []
}

function mobilesFromUser (userName, userEmail) {
  let finded
  if (userEmail) {
    finded = _.find(atTable, { userEmail })
  }
  if (!finded && userName) {
    finded = _.find(atTable, { userName })
  }
  if (finded) {
    return [ finded.phone ]
  }
  return []
}

module.exports = {
  mobilesFromAuthor,
  mobilesFromUser
}
