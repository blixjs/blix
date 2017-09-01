let fs = require('fs')
let path = require('path')
let name = process.argv[3]

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaWebpack = `const path = require('path')\n\nmodule.exports = {\n\tentry: './src/index.js',\n\toutput: {\n\t\tfilename: 'bundle.js',\n\t\tpath: path.resolve(__dirname, 'build')\n\t},\n\tmodule: {\n\t\tloaders: [\n\t\t\t{\n\t\t\t\ttest: /\\.js$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.jsx$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.css$/,\n\t\t\t\tloaders: "style-loader!css-loader"\n\t\t\t}\n\t\t]\n\t},\n\tresolve: {\n\t\textensions: ['.js', '.jsx', '.css']\n\t}\n}`
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`

let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.gitignore'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let babel = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.babelrc'), 'utf8')

let reactReduxServer = fs.readFileSync(path.resolve(__dirname, './files/reactReduxServer.js'), 'utf8')
let rootReducer = fs.readFileSync(path.resolve(__dirname, './files/rootReducer.js'), 'utf8')
let configStore = fs.readFileSync(path.resolve(__dirname, './files/configStore.js'), 'utf8')
let reactReduxIndex = fs.readFileSync(path.resolve(__dirname, './files/reactReduxIndex.js'), 'utf8')
let appContainer = fs.readFileSync(path.resolve(__dirname, './files/appContainer.js'), 'utf8')
let appRouter = fs.readFileSync(path.resolve(__dirname, './files/appRouter.js'), 'utf8')
let homeContainer = fs.readFileSync(path.resolve(__dirname, './files/homeContainer.js'), 'utf8')
let home = fs.readFileSync(path.resolve(__dirname, './files/home.js'), 'utf8')
let appRouterNoBackend = fs.readFileSync(path.resolve(__dirname, './files/appRouterNoBackend.js'), 'utf8')



let ReactReduxWithBackend = () => {

  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.mkdirSync(`./${name}/public`)
  fs.writeFile(`./${name}/public/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, reactReduxIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)
  fs.writeFile(`./${name}/src/containers/App/App.js`, appRouter, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer, (err) => {
    if (err) throw err
  })
  // need to write home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  fs.writeFile(`./${name}/src/containers/Home/Home.js`, home, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/configStore.js`, configStore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/actions`)
  fs.writeFile(`./${name}/src/actions/index.js`, '', (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/reducers`)
  fs.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer, (err) => {
    if (err) throw err
  })

  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, reactReduxServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}


let reactReduxWithoutBackend = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.writeFile(`./${name}/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, reactReduxIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)
  fs.writeFile(`./${name}/src/containers/App/App.js`, appRouterNoBackend, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer, (err) => {
    if (err) throw err
  })
  // need to write home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  fs.writeFile(`./${name}/src/containers/Home/Home.js`, home, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/configStore.js`, configStore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/actions`)
  fs.writeFile(`./${name}/src/actions/index.js`, '', (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/reducers`)
  fs.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = {
  ReactReduxWithBackend,
  reactReduxWithoutBackend
}