import * as fs from 'fs'

/**
 * helper function to generate alias path for module in project after adding
 * new module
 *
 * command-line: `ts-node ./scripts/alias-path-generator.ts MODULENAME`
 *
 * it will:
 *
 * - add `"^\\#MODULENAME/(.*)$": "<rootDir>/src/MODULENAME/$1"` to jest
 *   moduleNameMapper (files ./jest-unit.json, ./jest-cov.json,
 *   ./jest-e2e.json)
 * - add `"#MODULENAME/*": ["src/MODULENAME/*"]` to tsconfig.json
 * - add MODULENAME() method to ResponseBuilder class two lines before pre()
 *   method
 *
 * @param moduleName module (directory) name
 */
export const aliasPathGenerator = (moduleName: string) => {
  const jestUnit = JSON.parse(fs.readFileSync('./jest-unit.json', 'utf-8'))
  const jestCov = JSON.parse(fs.readFileSync('./jest-cov.json', 'utf-8'))
  const jestE2e = JSON.parse(fs.readFileSync('./jest-e2e.json', 'utf-8'))
  const jestE2eCov = JSON.parse(fs.readFileSync('./jest-e2ecov.json', 'utf-8'))
  const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf-8'))

  // add moduleName to moduleNameMapper in jest-x.json and paths in tsconfig.json
  jestUnit.moduleNameMapper[`^\\#${moduleName}/(.*)$`] =
    `<rootDir>/src/${moduleName}/$1`
  jestCov.moduleNameMapper[`^\\#${moduleName}/(.*)$`] =
    `<rootDir>/src/${moduleName}/$1`
  jestE2e.moduleNameMapper[`^\\#${moduleName}/(.*)$`] =
    `<rootDir>/src/${moduleName}/$1`
  jestE2eCov.moduleNameMapper[`^\\#${moduleName}/(.*)$`] =
    `<rootDir>/src/${moduleName}/$1`
  tsconfig.compilerOptions.paths[`#${moduleName}/*`] = [`src/${moduleName}/*`]

  fs.writeFileSync('./jest-unit.json', JSON.stringify(jestUnit, null, 2))
  fs.writeFileSync('./jest-cov.json', JSON.stringify(jestCov, null, 2))
  fs.writeFileSync('./jest-e2e.json', JSON.stringify(jestE2e, null, 2))
  fs.writeFileSync('./jest-e2ecov.json', JSON.stringify(jestE2eCov, null, 2))
  fs.writeFileSync('./tsconfig.json', JSON.stringify(tsconfig, null, 2))

  // add moduleName to ResponseBuilder class in resBuilder.util.ts
  const resBuilderUtil = fs.readFileSync('./utils/resBuilder.util.ts', 'utf-8')
  const resBuilderUtilLines = resBuilderUtil.split('\n')
  const preIndex =
    resBuilderUtilLines.findIndex((line) =>
      line.includes('pre(self: this) {')
    ) - 1
  resBuilderUtilLines.splice(
    preIndex,
    0,
    `  ${moduleName.slice(0, -1)}(id?: string) {`,
    `    this.msg += \`${moduleName.slice(0, -1)}\``,
    `    if (id) this.msg += \` id={\${id}}\``,
    `    return this`,
    `  }`
  )
  fs.writeFileSync('./utils/resBuilder.util.ts', resBuilderUtilLines.join('\n'))
}

aliasPathGenerator(process.argv[2])
