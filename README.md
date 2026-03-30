# Expo 自定义更新服务器 - 精简版

## 项目结构

```
UpdatesAPIDemo_app/
├── app/
│   └── App.tsx          # 主应用（含更新功能）
├── scripts/
│   └── upload-to-server.js  # 上传脚本
├── .github/workflows/
│   └── publish-update.yml   # GitHub Actions
├── app.config.ts        # Expo 配置
├── app.json
├── eas.json
└── package.json
```

## 快速开始

### 安装依赖
```bash
bun install
```

### 启动开发服务器
```bash
bun start
```

### 构建 APK
```bash
# preview (dev 分支)
eas build -e preview -p android

# production (main 分支)
eas build -e production -p android
```

### 推送更新
```bash
# 自动：git push 触发 GitHub Actions
# 手动：
node scripts/upload-to-server.js --channel preview -m "测试更新"
```

## 分支映射

| 分支 | Channel | 更新服务器 |
|------|---------|-----------|
| dev | preview | https://expo-test.duapp.dev/manifest/preview |
| main | production | https://expo-test.duapp.dev/manifest/production |
