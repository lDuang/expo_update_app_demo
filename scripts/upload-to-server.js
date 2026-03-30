const path = require('path')
const fs = require('fs')
const FormData = require('form-data')
const fetch = require('node-fetch')

const SERVER_URL = process.env.UPDATE_SERVER_URL || 'http://localhost:3001'
const CHANNEL = process.env.CHANNEL || 'preview'
const MESSAGE = process.env.MESSAGE || ''

async function main() {
  const projectRoot = path.resolve(__dirname, '..')
  const distDir = path.join(projectRoot, 'dist')

  console.log('📤 Uploading update to', SERVER_URL)
  console.log('   Channel:', CHANNEL)

  const metadata = JSON.parse(fs.readFileSync(path.join(distDir, 'metadata.json'), 'utf-8'))
  
  // 查找 bundle 文件（可能是 index.bundle 或 index.js）
  let bundlePath = path.join(distDir, 'bundles', 'android', 'index.bundle')
  if (!fs.existsSync(bundlePath)) {
    bundlePath = path.join(distDir, 'bundles', 'android-unsigned', 'index.bundle')
  }
  if (!fs.existsSync(bundlePath)) {
    bundlePath = path.join(distDir, 'index.bundle')
  }
  
  const bundle = fs.readFileSync(bundlePath)
  console.log('   Bundle:', bundlePath)

  const form = new FormData()
  form.append('channel', CHANNEL)
  form.append('runtimeVersion', metadata.runtimeVersion)
  form.append('message', MESSAGE)
  form.append('criticalIndex', '0')
  form.append('bundle', bundle, { filename: 'bundle.js', contentType: 'application/javascript' })

  const res = await fetch(`${SERVER_URL}/upload`, {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  const result = await res.json()
  if (result.success) {
    console.log('✅ Upload success!')
    console.log('   Update ID:', result.updateId)
    console.log('   Runtime:', metadata.runtimeVersion)
  } else {
    console.error('❌ Upload failed:', result.error)
    process.exit(1)
  }
}

main().catch(console.error)
