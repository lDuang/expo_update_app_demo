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

  // 打印 dist 目录结构
  console.log('📁 Dist directory contents:')
  if (fs.existsSync(distDir)) {
    const walk = (dir, prefix = '') => {
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        console.log(`   ${prefix}${stat.isDirectory() ? '📂' : '📄'} ${file}`)
        if (stat.isDirectory()) walk(fullPath, prefix + '  ')
      })
    }
    walk(distDir)
  } else {
    console.error('   dist directory not found!')
    process.exit(1)
  }

  const metadata = JSON.parse(fs.readFileSync(path.join(distDir, 'metadata.json'), 'utf-8'))
  
  // 查找 bundle 文件
  let bundlePath = path.join(distDir, 'bundles', 'android', 'index.bundle')
  if (!fs.existsSync(bundlePath)) {
    bundlePath = path.join(distDir, 'bundles', 'android-unsigned', 'index.bundle')
  }
  if (!fs.existsSync(bundlePath)) {
    // 尝试找 .bin 文件
    const bundlesDir = path.join(distDir, 'bundles')
    if (fs.existsSync(bundlesDir)) {
      const platforms = fs.readdirSync(bundlesDir)
      for (const platform of platforms) {
        const platformDir = path.join(bundlesDir, platform)
        const files = fs.readdirSync(platformDir)
        const bundleFile = files.find(f => f.endsWith('.bundle') || f.endsWith('.bin'))
        if (bundleFile) {
          bundlePath = path.join(platformDir, bundleFile)
          break
        }
      }
    }
  }
  
  if (!bundlePath || !fs.existsSync(bundlePath)) {
    console.error('❌ Bundle file not found!')
    process.exit(1)
  }
  
  console.log('   Bundle:', bundlePath)
  const bundle = fs.readFileSync(bundlePath)

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
