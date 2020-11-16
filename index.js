/**
 * Parse a mongodb uri and convert it to an object
 * @param {string} uri
 * @returns string
 */
const parse = (uri) => {
  const uriObject = {}
  const regexp = /^([a-zA-Z0-9]*):\/\/([a-zA-Z0-9:-]*@)?([a-zA-Z0-9.\-:,]*)+\/([a-zA-Z0-9-]*)(\?.*)?$/
  const result = regexp.exec(uri)

  if (result) {
    // scheme
    uriObject.scheme = result[1]

    // user/password
    if (result[2]) {
      const [username, password] = result[2].split(':')
      uriObject.username = username.replace('@', '')

      if (password) {
        uriObject.password = password.replace('@', '')
      }
    }

    // hosts
    if (result[3]) {
      uriObject.hosts = result[3].split(',').map((item) => {
        const [host, port] = item.split(':')
        return { host, port: parseInt(port) }
      })
    }

    // database
    if (result[4]) {
      uriObject.database = result[4]
    }

    // options
    if (result[5]) {
      uriObject.options = result[5].split('&').reduce((acc, current) => {
        const [key, value] = current.split('=')
        acc[key.replace('?', '')] = value
        return acc
      }, {})
    }
  } else {
    console.warn(`WARN: This uri not match with a mongodb uri: "${uri}"`)
  }
  return uriObject
}

/**
 * Parse an object and convert it to a mongodb uri
 * @type {object} obj
 * @type {string} obj.scheme
 * @type {string} [obj.username]
 * @type {string} [obj.password]
 * @type {object[]} obj.hosts
 * @type {string} obj.hosts.host
 * @type {string} obj.hosts.port
 * @type {string} obj.database
 * @type {object} [obj.options]
 * @returns {string}
 */
const format = (obj) => {
  const formatUsernamePassword = () => {
    if (!obj.username && !obj.password) {
      return ''
    }
    let buffer = ''
    if (obj.username) {
      buffer += obj.username
    }
    if (obj.password) {
      buffer += `:${obj.password}`
    }
    return `${buffer}@`
  }
  const formatHosts = () => {
    if (!obj.hosts) {
      return ''
    }
    return obj.hosts.map((item) => `${item.host}:${item.port}`).join(',')
  }

  const formatOptions = () => {
    if (!obj.options) {
      return ''
    }
    const result = []
    for (const [key, value] of Object.entries(obj.options)) {
      result.push(`${key}=${value}`)
    }
    return `?${result.join('&')}`
  }

  return `${obj.scheme}://${formatUsernamePassword()}${formatHosts()}/${obj.database}${formatOptions()}`
}

module.exports = { parse, format }
