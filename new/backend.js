const fs = require('fs')
const helpers = require('../helpers')
const path = require('path')
const name = process.argv[3]
const { createCommonFilesAndFolders } = require('./utils/createCommonFiles')
const { testBackend } = require('./utils/addBackendTests')
const { addMongooseToScripts } = require('./utils/addMongoDB')
const { addBookshelfToScripts } = require('./utils/addBookshelf')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

// load files
const cluster = loadFile('./files/backend/common/cluster.js')
const routes = loadFile('./files/backend/common/routes.js')

// mode is a string of either "backend","mvc" or "api"
// serverTestingSelection is a string of "mocha" or "jest"
const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  // if api mode need to create common files and folders
  if (mode === 'api') {
    createCommonFilesAndFolders()
  }
  // create folders
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/server/helpers`)
  if (mode !== 'api') {
    fs.mkdirSync(`./${name}/assets`)
  }

  // create files: routes.js cluster.js
  helpers.writeFile(`./${name}/server/routes.js`, routes)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)

  if (mode === 'standard') {
    // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
    standard()
  } else if (mode === 'mvc') {
    // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
    mvcType()
  } else {
    // api mode json only, no views, no cookies
    apiType()
  }

  addDatabase(databaseSelection)

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json
  scripts(mode)

  // packages to install
  packages(mode)
  // setup endpoint tests
  testBackend(serverTestingSelection)
}

const standard = () => {
  // mode for when there is a frontend framework
  fs.mkdirSync(`./${name}/server/views`)
  fs.mkdirSync(`./${name}/server/views/home`)
  helpers.writeFile(
    `./${name}/server/views/home/index.html`,
    loadFile('./files/frontend/other/index.html')
  )
  fs.writeFileSync(
    `./${name}/server/server.js`,
    loadFile('./files/backend/backend/server.js')
  )

  helpers.writeFile(
    `./${name}/server/controllers/home.js`,
    loadFile('./files/backend/backend/home.js')
  )
}

const mvcType = () => {
  const server = loadFile('./files/backend/mvc/server.js')
  const error = loadFile('./files/backend/mvc/error.pug')
  const layout = loadFile('./files/backend/mvc/layout.pug')
  const pug = loadFile('./files/backend/mvc/index.pug')

  fs.mkdirSync(`./${name}/server/views`)

  helpers.writeFile(`./${name}/server/views/error.pug`, error)
  helpers.writeFile(`./${name}/server/views/layout.pug`, layout)
  fs.mkdirSync(`./${name}/server/views/home`)
  helpers.writeFile(`./${name}/server/views/home/index.pug`, pug)

  fs.writeFileSync(`./${name}/server/server.js`, server)
}

const apiType = () => {
  fs.writeFileSync(
    `./${name}/server/server.js`,
    loadFile('./files/backend/api/server.js')
  )
  helpers.writeFile(
    `./${name}/server/controllers/home.js`,
    loadFile('./files/backend/api/home.js')
  )
}

const addDatabase = databaseSelection => {
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
}

const scripts = mode => {
  helpers.addScriptToNewPackageJSON('start', 'nodemon server/cluster.js')
  // controller script
  helpers.addScriptToNewPackageJSON('controller', 'node scripts/controller.js')
  helpers.writeFile(
    `./${name}/scripts/controller.js`,
    loadFile('./files/scripts/backend/controller.js')
  )
  helpers.writeFile(
    `./${name}/scripts/templates/controller.js`,
    loadFile('./files/scripts/backend/templates/controller.js')
  )
  helpers.writeFile(
    `./${name}/scripts/templates/routes.js`,
    loadFile('./files/scripts/backend/templates/routes.js')
  )
}

const packages = mode => {
  if (mode === 'standard') {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser'
    )
  } else if (mode === 'mvc') {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser pug'
    )
  } else {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan'
    )
  }
}

module.exports = {
  createBackend
}