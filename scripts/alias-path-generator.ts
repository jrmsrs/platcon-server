import * as fs from 'fs'

/**
 * helper function to generate alias path for module in project after adding new module
 *
 * command-line: `ts-node ./scripts/alias-path-generator.ts MODULENAME`
 *
 * it will:
 *
 * - add `"^\\#MODULENAME/(.*)$": "<rootDir>/src/MODULENAME/$1"` to jest moduleNameMapper (files ./jest-unit.json, ./jest-cov.json, ./jest-e2e.json)
 * - add `"#MODULENAME/*": ["src/MODULENAME/*"]` to tsconfig.json
 *
 * @param moduleName module (directory) name
 */
export const aliasPathGenerator = (moduleName: string) => {
  const jestUnit = JSON.parse(fs.readFileSync('./jest-unit.json', 'utf-8'))
  const jestCov = JSON.parse(fs.readFileSync('./jest-cov.json', 'utf-8'))
  const jestE2e = JSON.parse(fs.readFileSync('./jest-e2e.json', 'utf-8'))
  const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf-8'))

  // add moduleName to moduleNameMapper in jest-x.json and paths in tsconfig.json
  jestUnit.moduleNameMapper[`^\\#${moduleName}/(.*)$`] = `<rootDir>/src/${moduleName}/$1`
  jestCov.moduleNameMapper[`^\\#${moduleName}/(.*)$`] = `<rootDir>/src/${moduleName}/$1`
  jestE2e.moduleNameMapper[`^\\#${moduleName}/(.*)$`] = `<rootDir>/src/${moduleName}/$1`
  tsconfig.compilerOptions.paths[`#${moduleName}/*`] = [`src/${moduleName}/*`]

  // write to files
  fs.writeFileSync('./jest-unit.json', JSON.stringify(jestUnit, null, 2))
  fs.writeFileSync('./jest-cov.json', JSON.stringify(jestCov, null, 2))
  fs.writeFileSync('./jest-e2e.json', JSON.stringify(jestE2e, null, 2))
  fs.writeFileSync('./tsconfig.json', JSON.stringify(tsconfig, null, 2))
}

aliasPathGenerator(process.argv[2])
