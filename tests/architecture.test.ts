import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { expect, it } from 'vitest'

it('keeps core independent of React, the DOM and rendering libraries', () => {
  function inspect(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) inspect(path)
      else {
        const source = readFileSync(path, 'utf8')
        expect(source).not.toMatch(/\b(?:document|window|HTMLElement|React)\b/)
        for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) expect(match[1]).toMatch(/^\.\.?\//)
      }
    }
  }
  inspect('src/core')
})
