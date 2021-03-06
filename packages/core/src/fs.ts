import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as path from 'path'
const { _loadFile } = require('@blixai/files') // tslint:disable-line
import { emit } from './events'
import {
  logAppend,
  logCreate,
  logDeleted,
  logError,
  logInsert,
  logMutate,
  logWarning,
} from './logger'
import { _logCaughtError, prettyPath } from './utils'
const store = require('./store')

export function writeFile(filePath: string, file: string) {
  try {
    filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
    const filePathLog = prettyPath(filePath)
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file)
      logMutate(filePathLog)
    } else {
      fs.writeFileSync(filePath, file)
      logCreate(filePathLog)
    }
    emit({ status: 'success', action: 'write file', file: filePath })
  } catch (err) {
    emit({ status: 'error', action: 'write file', file: filePath })
    _logCaughtError(`Couldn't create file ${filePath}`, err)
  }
}

export function mkdirSync(folderPath: string) {
  if (!folderPath && !store.name) {
    return logError(`Unable to create folder`)
  } else if (!folderPath) {
    folderPath = ''
  }

  try {
    folderPath = store.name
      ? `./${store.name}/` + folderPath
      : './' + folderPath
    const folderPathLog = prettyPath(folderPath)
    fs.mkdirSync(folderPath)
    logCreate(folderPathLog)
    emit({ status: 'success', action: 'make folder', folder: folderPath })
  } catch (err) {
    emit({ status: 'error', action: 'make folder', folder: folderPath })
    _logCaughtError(`Error making directory ${folderPath}`, err)
  }
}

export function rename(oldName: string, newName: string) {
  try {
    fs.renameSync(oldName, newName)

    oldName = prettyPath(oldName)
    newName = prettyPath(newName)
    logWarning(`move   ${oldName} into ${newName}`)
    emit({ status: 'success', action: 'rename' })
  } catch (err) {
    emit({ status: 'error', action: 'rename' })
    _logCaughtError(`Error renaming ${oldName}`, err)
  }
}

export async function insert(
  fileToInsertInto: string,
  whatToInsert: string,
  lineToInsertAt?: number,
) {
  if (!fileToInsertInto) {
    return logError(`No file specified.`)
  } else if (!whatToInsert) {
    return logError('No string to insert specified.')
  }
  // this needs to get extracted into its own helper
  const fileToInsertIntoLog = prettyPath(fileToInsertInto)

  const filePrompt = {
    choices: [],
    message: 'Select a line to insert below',
    name: 'lineNumber',
    type: 'list',
  }
  // if no lineToInsertAt then readfile and pass to inquirer prompt
  try {
    const file: any = fs
      .readFileSync(fileToInsertInto, 'utf8')
      .toString()
      .split('\n')

    if (lineToInsertAt === undefined) {
      filePrompt.choices = file
      const lineToInsertAfter: any = await inquirer.prompt([filePrompt])
      lineToInsertAt = file.indexOf(lineToInsertAfter) + 1
    } else if (isNaN(Number(lineToInsertAt))) {
      const indexToFind = file.indexOf(lineToInsertAt)
      if (indexToFind !== -1) {
        lineToInsertAt = indexToFind + 1
      } else {
        lineToInsertAt = file.length + 1
      }
    }
    file.splice(lineToInsertAt, 0, whatToInsert)
    const finishedFile = file.join('\n')
    fs.writeFileSync(fileToInsertInto, finishedFile)
    logInsert(fileToInsertIntoLog)
    emit({ status: 'success', action: 'insert' })
  } catch (err) {
    emit({ status: 'errror', action: 'insert' })
    _logCaughtError(`Failed to insert into ${fileToInsertIntoLog}`, err)
  }
}

export function appendFile(file: string, stringToAppend: string) {
  if (!file) {
    return logError(`File not provided.`)
  } else if (!stringToAppend) {
    return logError(`No string to append provided.`)
  }

  try {
    file = store.name ? `./${store.name}/` + file : './' + file
    fs.appendFileSync(file, stringToAppend)
    file = prettyPath(file)
    logAppend(file)
    emit({ status: 'success', action: 'appendFile' })
  } catch (err) {
    _logCaughtError(`Failed to append ${file}.`, err)
  }
}

export function moveAllFilesInDir(dirToSearch: string, dirToMoveTo: string) {
  try {
    fs.readdirSync(dirToSearch).forEach((file: string) => {
      if (
        file === 'actions' ||
        file === 'components' ||
        file === 'store' ||
        file === 'api'
      ) {
        return
      }
      try {
        rename(dirToSearch + '/' + file, dirToMoveTo + '/' + file)
      } catch (err) {
        _logCaughtError(
          `Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`,
          err,
        )
      }
    })
  } catch (err) {
    _logCaughtError(`Failed to read directory`, err)
    return
  }

  try {
    fs.rmdirSync(dirToSearch)
    dirToSearch = prettyPath(dirToSearch)
    logDeleted(dirToSearch)
    emit({ status: 'success', action: 'moveAllFilesInDir' })
  } catch (err) {
    emit({ status: 'error', action: 'moveAllFilesInDir' })
    _logCaughtError(`Failed to delete ${dirToSearch}.`, err)
  }
}

export function loadFile(file: string, folderPath: string): string {
  if (!folderPath) {
    folderPath = '/scripts/templates/'
  }
  file = prettyPath(file)
  try {
    if (store.mode === 'cli') {
      file = _loadFile(file)
    } else {
      file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8')
    }
    if (!file) {
      throw new Error(`File ${file} not found!`)
    }
    return file
  } catch (err) {
    _logCaughtError(`Failed to load file ${file}`, err)
    return ''
  }
}

export function loadJSONFile(file: string, folderPath: string): string {
  // TODO ensure the file type is .json
  if (!folderPath) {
    folderPath =
      store.mode === 'cli' ? '../../cli/files/' : '/scripts/templates'
  }

  file = prettyPath(file)

  try {
    if (store.mode === 'cli') {
      file = fs.readFileSync(path.resolve(__dirname, folderPath + file), 'utf8')
    } else {
      file = fs.readFileSync(process.cwd() + folderPath + file, 'utf8')
    }
    if (!file) {
      throw new Error(`JSON file ${file} not found!`)
    }
    return JSON.parse(file)
  } catch (err) {
    _logCaughtError(`Failed to load json file ${file}`, err)
    return ''
  }
}

export function writeJSONFile(filePath: string, file: object) {
  try {
    const fileString = JSON.stringify(file, null, 2)
    filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
    const filePathLog = prettyPath(filePath)
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, fileString)
      logMutate(filePathLog)
    } else {
      fs.writeFileSync(filePath, fileString)
      logCreate(filePathLog)
    }
  } catch (err) {
    _logCaughtError(`Failed to write to file ${filePath}`, err)
  }
}

/**
 * @description load a package.json from the cli user directly, often used for package.json checks/file manipulation
 * @param file
 */
export function loadUserJSONFile(file: string): string {
  // TODO ensure the file type is .json

  file = prettyPath(file)

  try {
    file = fs.readFileSync('./' + file, 'utf8')
    if (!file) {
      throw new Error(`JSON file ${file} not found!`)
    }
    return JSON.parse(file)
  } catch (err) {
    _logCaughtError(`Failed to load json file ${file}`, err)
    return ''
  }
}

/**
 * @param { string[] } dirs - strings of directories to create, sync, in order
 */
export function createMultipleFolders(dirs: [string]) {
  dirs.forEach(directory => {
    mkdirSync(directory)
  })
}

/*
@example:
  createFilesAndFolders(startFolderPath, {
      folder: {
          'file.ex'
      },
      'file.js',
      'file.py',
      folder: {
          folder: {
              folder: {
                  'file.md'
              }
          },
          'file.rb'
      }
  });
*/

/**
 * @description creates files and folders by just passing an object with the structure
 *
 * @param filePath - where to start building the new files and folders from
 * @param filesAndFolderObject - object
 */
export function createFilesAndFolders(
  filePath: string,
  filesAndFolderObject: any,
) {
  if (filePath && filePath.trim() === '') {
    filePath = './'
  }

  // for each level, recursively call itself and pass the new start path
  const fileKeys = Object.keys(filesAndFolderObject)

  fileKeys.forEach(key => {
    const currentPath = filePath + '/' + key
    if (typeof filesAndFolderObject[key] === 'string') {
      writeFile(currentPath, filesAndFolderObject[key])
    } else if (typeof filesAndFolderObject[key] === 'object') {
      const pathToCheck = store.name
        ? `./${store.name}/${currentPath}`
        : currentPath
      if (!fs.existsSync(pathToCheck)) {
        mkdirSync(currentPath)
      }
      createFilesAndFolders(currentPath, filesAndFolderObject[key])
    }
  })
}
