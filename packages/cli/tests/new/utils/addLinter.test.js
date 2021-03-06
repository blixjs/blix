let store = require('../../../new/store')
let helpers = require('../../../helpers')

jest.mock('../../../helpers')

let {
  eslintPackageJsonScripts,
  addLinter
} = require('../../../new/utils/addLinter')

describe('Utils module: addLinter', () => {

  describe('addLinter', () => {
    beforeEach(() => {
      store.linter = ''
    })

    it('adds prettier if selected', () => {
      store.linter = 'prettier'
      addLinter()

      expect(helpers.addDependenciesToStore).toHaveBeenCalledWith('prettier', 'dev')
      expect(helpers.writeFile).toHaveBeenCalledTimes(1)
      expect(helpers.addScriptToPackageJSON).toBeCalledTimes(1)
    })

    it('adds eslint if selected', () => {
      store.linter = 'eslint'
      addLinter()

      expect(helpers.addDependenciesToStore).toHaveBeenCalledWith('eslint eslint-plugin-react', 'dev')
      expect(helpers.writeFile).toHaveBeenCalledTimes(1)
    })

    it('adds eslint + prettier if selected', () => {
      store.linter = 'eslint_prettier'
      addLinter()

      expect(helpers.addDependenciesToStore).toHaveBeenCalledTimes(1)
      expect(helpers.writeFile).toHaveBeenCalledTimes(1)
    })
  })

  describe('eslintPackageJsonSCripts', () => {
    beforeEach(() => {
      store.backend = {backend: false}
      store.reactType = ''
    })

    it('adds script to package.json if backend selected and frontend type is React', () => {
      store.backend = {backend: true}
      store.reactType = 'react'
      eslintPackageJsonScripts()

      expect(helpers.addScriptToPackageJSON).toHaveBeenCalledWith('lint', `eslint 'src/**/*.js' 'server/**/*.js'`)
    })

    it('adds script to package.json if only backend', () => {
      store.backend = {backend: true}
      eslintPackageJsonScripts()

      expect(helpers.addScriptToPackageJSON).toHaveBeenCalledWith('lint', `eslint 'server/**/*.js'`)
    })

    it('adds script to package.json if only a frontend React type', () => {
      store.reactType = 'react'
      eslintPackageJsonScripts()

      expect(helpers.addScriptToPackageJSON).toHaveBeenCalledWith('lint', `eslint 'src/**/*.js'`)
    })

    it('adds script to package.json if only a frontend Redux type', () => {
      store.reactType = 'redux'
      eslintPackageJsonScripts()

      expect(helpers.addScriptToPackageJSON).toHaveBeenCalledWith('lint', `eslint 'src/**/*.js'`)
    })

    it('doesn\'t add lint script to package.json if no backend or frontend isn\'t react', () => {
      eslintPackageJsonScripts()

      expect(helpers.addScriptToPackageJSON).toHaveBeenCalledTimes(0)
    })
  })
})




