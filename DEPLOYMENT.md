# 部署指南

## 快速开始

### 使用部署脚本（推荐）

#### Windows 用户
```cmd
# 运行完整部署流程
deploy.bat

# 仅构建项目
deploy.bat --build-only

# 仅执行 Git 操作
deploy.bat --git-only

# 仅执行 Vercel 部署
deploy.bat --deploy-only
```

#### Linux/Mac 用户
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行完整部署流程
./deploy.sh

# 查看帮助
./deploy.sh --help
```

### 手动部署步骤

1. **构建项目**
   ```bash
   npm install
   npm run build
   ```

2. **代码质量检查**
   ```bash
   npx tsc --noEmit
   npm run lint
   ```

3. **提交代码**
   ```bash
   git add .
   git commit -m "chore: deploy $(date)"
   git push origin main
   ```

4. **Vercel 部署**
   - 自动：Vercel 会检测到 GitHub 推送并自动部署
   - 手动：在 Vercel 仪表板中点击 "Redeploy"

## 部署配置

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### vite.config.ts
```typescript
base: '/', // 使用根路径，便于 Vercel 部署
```

## 故障排除

### 常见问题

1. **权限错误**
   ```
   sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied
   ```
   - 解决方案：确保使用正确的构建命令 `npm run build`

2. **构建失败**
   - 检查 TypeScript 错误：`npx tsc --noEmit`
   - 检查依赖：`npm install`

3. **部署后页面空白**
   - 检查 `vite.config.ts` 中的 `base` 配置
   - 确保路由配置正确

### 手动配置 Vercel

如果自动部署失败，可以在 Vercel 项目设置中手动配置：

1. **Build & Development Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**
   - 通常不需要额外环境变量

## 监控和日志

- **Vercel 仪表板**: 查看部署状态和日志
- **GitHub Actions**: 查看构建状态
- **浏览器控制台**: 检查前端错误

## 联系方式

如有问题，请检查：
- [GitHub Issues](https://github.com/stuboyfly/study-EN/issues)
- Vercel 部署日志
- 项目文档