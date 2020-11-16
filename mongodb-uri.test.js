/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const assert = require('assert').strict
const { parse, format } = require('../mongodb-uri')

describe('Mongodb-uri', () => {
  describe('parse', () => {
    it('should parse a full mongodb uri', () => {
      const mongodbUri = 'mongodb://bib:abcdef123@europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        username: 'bib',
        password: 'abcdef123',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
    it('should parse a mongodb uri without password', () => {
      const mongodbUri = 'mongodb://bib@europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        username: 'bib',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
    it('should parse a mongodb uri without username/password', () => {
      const mongodbUri = 'mongodb://europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
    it('should parse a mongodb uri with one host', () => {
      const mongodbUri = 'mongodb://bib:abcdef123@europe-1.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        username: 'bib',
        password: 'abcdef123',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
    it('should parse a mongodb uri without options', () => {
      const mongodbUri = 'mongodb://bib:abcdef123@europe-1.host.net:27017/database-name'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        username: 'bib',
        password: 'abcdef123',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 }
        ],
        database: 'database-name'
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
    it('should parse a local mongodb uri', () => {
      const mongodbUri = 'mongodb://127.0.0.1:27017/database-name'
      const mongodbUriObject = parse(mongodbUri)

      const expected = {
        scheme: 'mongodb',
        hosts: [
          { host: '127.0.0.1', port: 27017 }
        ],
        database: 'database-name'
      }
      assert.deepEqual(mongodbUriObject, expected)
    })
  })
  describe('format', () => {
    it('should format a mongodb uri object', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        username: 'bib',
        password: 'abcdef123',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      const expected = 'mongodb://bib:abcdef123@europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
    it('should format a mongodb uri object without password', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        username: 'bib',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      const expected = 'mongodb://bib@europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
    it('should format a mongodb uri object without username and password', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 },
          { host: 'europe-2.host.net', port: 27017 },
          { host: 'europe-3.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      const expected = 'mongodb://europe-1.host.net:27017,europe-2.host.net:27017,europe-3.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
    it('should format a mongodb uri object with one host', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 }
        ],
        database: 'database-name',
        options: {
          ssl: 'true',
          replicaSet: 'europe-host-shard-0',
          authSource: 'admin'
        }
      }
      const expected = 'mongodb://europe-1.host.net:27017/database-name?ssl=true&replicaSet=europe-host-shard-0&authSource=admin'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
    it('should format a mongodb uri object without options', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        username: 'bib',
        password: 'abcdef123',
        hosts: [
          { host: 'europe-1.host.net', port: 27017 }
        ],
        database: 'database-name'
      }
      const expected = 'mongodb://bib:abcdef123@europe-1.host.net:27017/database-name'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
    it('should format a local mongodb uri object', () => {
      const mongodbUriObject = {
        scheme: 'mongodb',
        hosts: [
          { host: '127.0.0.1', port: 27017 }
        ],
        database: 'database-name'
      }
      const expected = 'mongodb://127.0.0.1:27017/database-name'
      const mongodbUri = format(mongodbUriObject)
      assert.deepEqual(mongodbUri, expected)
    })
  })
})
