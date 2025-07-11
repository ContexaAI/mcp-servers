import path from 'node:path'
import { fileURLToPath } from 'url'

import { contexaStart } from './contexa-server'
import { initProxy, ValidationError } from './init-server'

export async function startServer() {
  const filename = fileURLToPath(import.meta.url)
  const directory = path.dirname(filename)
  const specPath = path.resolve(directory, '../scripts/notion-openapi.json')

  const baseUrl = process.env.BASE_URL ?? undefined
  const proxy = await initProxy(specPath, baseUrl)

  contexaStart(proxy.getServer())
}

startServer().catch(error => {
  if (error instanceof ValidationError) {
    console.error('Invalid OpenAPI 3.1 specification:')
    error.errors.forEach(err => console.error(err))
  } else {
    console.error('Error:', error)
  }
  process.exit(1)
})
