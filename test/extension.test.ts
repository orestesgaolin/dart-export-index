import * as assert from 'assert'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as vscode from 'vscode'
import { addCurrentFileToIndexDart } from '../src/commands/commands'
import * as extension from '../src/extension'
import { ApplicationError } from '../src/utils'

const testResourcesPath = path.join(__dirname, 'test-resources')

suite('Extension Tests', () => {
  suite('addCurrentFileToIndexDart', () => {
    setup(() => {
      mkdirp.sync(testResourcesPath)
      fs.writeFileSync(path.join(testResourcesPath, 'foo.ts'), '')
      fs.writeFileSync(path.join(testResourcesPath, 'bar.ts'), '')
    })

    teardown(() => {
      rimraf(testResourcesPath, () => { })
    })

    suite('when the file is not opened', () => {
      test('fails with error', () => {
        // TODO
      })
    })

    suite('when the file is not saved', () => {
      test('fails with error', () => {
        // TODO
      })
    })

    suite('when the index file does not exist', () => {
      test('creates index file', () => {
        // TODO
      })

      test('add an exportation line for the file', () => {
        // TODO
      })
    })

    suite('when the index file exists', () => {
      test('add an exportation line for the file', () => {
        // TODO
      })
    })
  })
})
