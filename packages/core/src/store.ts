const debug = require('debug')
const storeDebug = require('debug')('blix:core:store')
const getDebug = require('debug')('blix:core:store:get')
const setDebug = require('debug')('blix:core:store:set')

const store = {
  name: '',
  frontend: '',
  backend: '',
  backendType: '',
  database: '',
  serverTesting: '',
  e2e: '',
  reactTesting: '',
  vueTesting: '',
  reactType: '',
  dependencies: '',
  devDependencies: '',
  useYarn: '',
  reactCSS: '',
  linter: '',
  tasks: [],
  blixNeedsUpdate: false,
  blixFailedToCheckForUpdates: false,
}

function checkIfEnvChange (key: string, value: string) {
  if (key === 'env' && value === 'development') {
    debug.enable('blix:*')
    storeDebug('\nStore debugging enabled')
  } else if (key === 'env' && value !== 'development') {
    if (debug.enabled) {
      storeDebug('Store debugging disabled.')
    }
    debug.disable()
  }
}

const handler = {
  get(target: any, key: string) {
    let result = Reflect.get(target, key);
    if (debug.enabled) {
      getDebug('get %o. Current value is: %o', key, result);
    }
    return result
  },
  set(_: object, key: string, value: any) {
    checkIfEnvChange(key, value)
    if (debug.enabled) {
      setDebug('set %o to %o', key, value)
    }
    return Reflect.set(_, key, value);
  }
}

module.exports = new Proxy(store, handler)