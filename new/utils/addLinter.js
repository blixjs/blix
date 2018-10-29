const fs = require('fs')
const path = require('path')
const helpers = require('../../helpers')
const store = require('../store')

const loadFile = filePath => {
    let root = '../files/'
    return fs.readFileSync(path.resolve(__dirname, root + filePath), "utf8");
};

let prettierConfig = loadFile('common/linter/prettier.js')
let eslintBasicConfig = loadFile('common/linter/eslintBasic.js')
let eslintPrettier = loadFile('common/linter/eslintPrettier.js')

const eslintPackageJsonScripts = () => {
    if (store.backend.backend && store.reactType) {
        helpers.addScript('lint', `eslint 'src/**/*.js' 'server/**/*.js'`)
    } else if (store.backend.backend) {
        helpers.addScript('lint', `eslint 'server/**/*.js'`)
    } else if (store.reactType) {
        helpers.addScript('lint', `eslint 'src/**/*.js'`)
    }
}

const addLinter = () => {
    if (store.linter === 'prettier') {
        helpers.addDevDependenciesToStore('prettier')
        helpers.writeFile(`prettier.config.js`, prettierConfig)
        helpers.addScript('lint', `prettier --config prettier.config.js --write '**/*.js'`)
    } else if (store.linter === 'eslint') {
        helpers.addDevDependenciesToStore('eslint eslint-plugin-react')
        helpers.writeFile(`.eslintrc.js`, eslintBasicConfig)
        eslintPackageJsonScripts()
    } else if (store.linter === 'eslint_prettier') {
        helpers.addDevDependenciesToStore('eslint eslint-plugin-react eslint-config-prettier eslint-plugin-prettier prettier')
        helpers.writeFile(`.eslintrc.js`, eslintPrettier)
        eslintPackageJsonScripts()
    }
}

module.exports = { addLinter, eslintPackageJsonScripts }