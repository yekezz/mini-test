import fs from 'fs';
// import {
//   expect
// } from './util.js';
import {
  expect
} from 'expect'
import chalk from 'chalk';
import glob from 'glob';

export class Test {

  hasFailed = false

  run() {
    this.hasFailed = false
    const testFiles = this.getFile()
    Array.from(testFiles).map((testFile) => {
      this.work(testFile)
    })
    this.exitCode()
  }

  work(filePath) {
    const code = this.getCode(filePath)
    const result = this.test(code)
    this.parseResult(filePath, result)
  }


  getFile() {
    const path = this.filterFiles()
    return glob.sync(path);
  }

  getCode(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }

  test(code) {
    const result = {
      success: false,
      errorMessage: ''
    }
    const testInfo = {
      testPartName: ''
    }
    try {
      this.exec(code, testInfo)
      result.success = true;
    } catch (error) {
      result.errorMessage = `${testInfo.testPartName} \n  ${error.message}`;
    }
    return result
  }

  exec(code, testInfo) {
    const describeFns = [];
    let currentDescribeFn = [];
    const describe = (name, fn) => describeFns.push([name, fn]);
    const it = (name, fn) => currentDescribeFn.push([name, fn]);
    eval(code);
    for (const [name, fn] of describeFns) {
      testInfo.testPartName = ''
      const testName = name
      currentDescribeFn = []
      fn()

      currentDescribeFn.forEach(([name, fn]) => {
        testInfo.testPartName = `${testName} ${name}`
        fn()
      })
    }
  }

  parseResult(filepath, {
    success,
    errorMessage
  }) {
    const status = success ?
      chalk.green.inverse.bold(' PASS ') :
      chalk.red.inverse.bold(' FAIL ');
    console.log(status + ' ' + chalk.dim(filepath));
    if (!success) {
      this.hasFailed = true
      console.log('  ' + errorMessage);
    }
  }

  filterFiles() {
    return process.argv[2] ? `**/${process.argv[2]}*` : '**/*.test.js'
  }

  exitCode() {
    if (this.hasFailed) {
      console.log(
        '\n' + chalk.red.bold('Test run failed, please fix all the failing tests.'),
      );
      // Set an exit code to indicate failure.
      process.exitCode = 1;
    } else {
      console.log(
        '\n' + chalk.green.bold('Pass all tests successfully.'),
      );
    }
    // Set an exit code to indicate failure.
    process.exitCode = 1;
  }
}
