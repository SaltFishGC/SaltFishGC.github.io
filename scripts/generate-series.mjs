import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import { join, resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = join(ROOT, 'docs')
const OUTPUT_FILE = join(ROOT, '.vuepress', 'auto-series.json')

const SERIES_PREFIX = '/docs/'

function naturalSort(arr) {
  return arr.sort((a, b) => {
    const aParts = a.match(/(\d+|\D+)/g) || []
    const bParts = b.match(/(\d+|\D+)/g) || []
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aIsNum = /^\d+$/.test(aParts[i])
      const bIsNum = /^\d+$/.test(bParts[i])
      if (aIsNum && bIsNum) {
        const diff = parseInt(aParts[i], 10) - parseInt(bParts[i], 10)
        if (diff !== 0) return diff
      } else {
        const cmp = aParts[i].localeCompare(bParts[i], 'zh-CN')
        if (cmp !== 0) return cmp
      }
    }
    return aParts.length - bParts.length
  })
}

async function readSeriesMeta(dirPath) {
  const metaPath = join(dirPath, '_series.json')
  try {
    const content = await readFile(metaPath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function buildSeriesItems(dirPath, prefix) {
  const entries = await readdir(dirPath, { withFileTypes: true })
  const dirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== '.vuepress')
  const files = entries.filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md')

  const meta = await readSeriesMeta(dirPath)
  const itemMap = new Map()

  for (const dir of dirs) {
    const childPath = join(dirPath, dir.name)
    const childPrefix = prefix ? `${prefix}/${dir.name}` : dir.name
    const children = await buildSeriesItems(childPath, childPrefix)
    if (children.length > 0) {
      const displayName = meta?.names?.[dir.name] || dir.name
      itemMap.set(dir.name, {
        text: displayName,
        children
      })
    }
  }

  for (const file of files) {
    const nameWithoutExt = file.name.replace(/\.md$/, '')
    const link = prefix ? `${prefix}/${nameWithoutExt}` : nameWithoutExt
    const displayName = meta?.names?.[nameWithoutExt] || nameWithoutExt
    itemMap.set(nameWithoutExt, link)
  }

  let orderedKeys = [...itemMap.keys()]
  if (meta?.order) {
    const orderSet = new Set(meta.order)
    const ordered = meta.order.filter(k => itemMap.has(k))
    const remaining = orderedKeys.filter(k => !orderSet.has(k))
    orderedKeys = [...ordered, ...naturalSort(remaining)]
  } else {
    orderedKeys = naturalSort(orderedKeys)
  }

  return orderedKeys.map(k => itemMap.get(k))
}

async function buildSeriesConfig() {
  const entries = await readdir(DOCS_DIR, { withFileTypes: true })
  const dirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'))

  const rootMeta = await readSeriesMeta(DOCS_DIR)
  const groupMap = new Map()

  for (const dir of dirs) {
    const dirPath = join(DOCS_DIR, dir.name)
    const children = await buildSeriesItems(dirPath, dir.name)
    if (children.length > 0) {
      const displayName = rootMeta?.names?.[dir.name] || dir.name
      groupMap.set(dir.name, {
        text: displayName,
        collapsible: false,
        children
      })
    }
  }

  const rootFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md')
  for (const file of rootFiles) {
    const nameWithoutExt = file.name.replace(/\.md$/, '')
    const displayName = rootMeta?.names?.[nameWithoutExt] || nameWithoutExt
    groupMap.set(nameWithoutExt, displayName)
  }

  let orderedKeys = [...groupMap.keys()]
  if (rootMeta?.order) {
    const orderSet = new Set(rootMeta.order)
    const ordered = rootMeta.order.filter(k => groupMap.has(k))
    const remaining = orderedKeys.filter(k => !orderSet.has(k))
    orderedKeys = [...ordered, ...naturalSort(remaining)]
  } else {
    orderedKeys = naturalSort(orderedKeys)
  }

  const seriesItems = orderedKeys.map(k => groupMap.get(k))
  const config = { [SERIES_PREFIX]: seriesItems }

  await writeFile(OUTPUT_FILE, JSON.stringify(config, null, 2), 'utf-8')
  console.log(`✅ Auto-series config generated: ${relative(ROOT, OUTPUT_FILE)}`)
  console.log(`   ${seriesItems.length} top-level groups, prefix: ${SERIES_PREFIX}`)
}

buildSeriesConfig().catch(err => {
  console.error('❌ Failed to generate series config:', err)
  process.exit(1)
})
