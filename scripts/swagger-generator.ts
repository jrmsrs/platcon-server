import { Test } from '@nestjs/testing'
import * as fs from 'fs'

import { SwaggerModule } from '@nestjs/swagger'
import * as yaml from 'js-yaml'

import { AppModule } from '#app/app.module'
import { swaggerConfig } from '#app/main'
import { execFile } from 'child_process'

/**
 * helper function to generate API.md from current application swagger
 *
 * command-line: `ts-node ./scripts/swagger-generator.ts`
 *
 * it will:
 *
 * - generate swaggerv3.yaml from current application swagger using yaml.dump
 *   on SwaggerModule.createDocument
 * - convert swaggerv3.yaml to swaggerv2.yaml using api-spec-converter cli
 * - generate API.md from swaggerv2.yaml using swagger-markdown cli then remove
 *   output directory
 */
const generateSwaggerYaml = async () => {
  const o = './scripts/output'
  const app = (
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
  ).createNestApplication()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  if (!fs.existsSync(o)) {
    fs.mkdirSync(o)
  }

  fs.writeFileSync(`${o}/v3.yaml`, yaml.dump(document))

  let swaggerYaml: string
  execFile(
    'yarn',
    [
      'api-spec-converter',
      '--from',
      'openapi_3',
      '--syntax',
      'yaml',
      '--to',
      'swagger_2',
      `${o}/v3.yaml`,
      '>',
      `${o}/v2.yaml`,
    ],
    (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`)
        process.exit(1)
      }
      swaggerYaml = stdout.substring(stdout.indexOf('\n') + 1)
      fs.writeFileSync(`${o}/v2.yaml`, swaggerYaml)

      execFile(
        'yarn',
        ['swagger-markdown', '-i', `${o}/v2.yaml`, '-o', './API.md'],
        (error) => {
          if (error) {
            fs.rmSync(o, { recursive: true })
            console.error(`exec error: ${error}`)
            process.exit(1)
          }
          fs.rmSync(o, { recursive: true })
          process.exit(0)
        }
      )
    }
  )
}

generateSwaggerYaml()
