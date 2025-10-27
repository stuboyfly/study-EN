@echo off
chcp 65001 >nul

REM 部署脚本 - Vercel 自动化部署 (Windows 版本)
REM 作者: Claude Code
REM 描述: 自动构建、提交并部署到 Vercel

echo.
echo ========================================
echo        Vercel 自动化部署脚本
echo ========================================
echo.

setlocal enabledelayedexpansion

REM 检查依赖
echo ℹ️  检查系统依赖...

git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安装，请先安装 Git
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装，请先安装 npm
    exit /b 1
)

echo ✅ 所有依赖检查通过

REM 检查代码质量
echo.
echo ℹ️  检查代码质量...

REM TypeScript 类型检查
npx tsc --noEmit >nul 2>&1
if errorlevel 1 (
    echo ❌ TypeScript 类型检查失败
    exit /b 1
) else (
    echo ✅ TypeScript 类型检查通过
)

REM ESLint 检查
npm run lint >nul 2>&1
if errorlevel 1 (
    echo ⚠️  ESLint 检查发现问题，但继续部署...
) else (
    echo ✅ ESLint 检查通过
)

REM 构建项目
echo.
echo ℹ️  开始构建项目...

REM 安装依赖
echo ℹ️  安装项目依赖...
npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ 依赖安装失败
    exit /b 1
) else (
    echo ✅ 依赖安装成功
)

REM 构建项目
echo ℹ️  构建生产版本...
npm run build >nul 2>&1
if errorlevel 1 (
    echo ❌ 项目构建失败
    exit /b 1
) else (
    echo ✅ 项目构建成功
)

REM Git 操作
echo.
echo ℹ️  执行 Git 操作...

REM 检查 Git 状态
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ 当前目录不是 Git 仓库
    exit /b 1
)

REM 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo ℹ️  当前分支: !CURRENT_BRANCH!

REM 添加所有更改
echo ℹ️  添加文件到暂存区...
git add . >nul 2>&1

REM 检查是否有更改
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    REM 有更改，提交并推送
    for /f "tokens=1-3 delims=: " %%a in ('echo %time%') do set TIMESTAMP=%%a%%b%%c
    set COMMIT_MESSAGE=chore: deploy %date% !TIMESTAMP!
    echo ℹ️  提交更改: !COMMIT_MESSAGE!

    git commit -m "!COMMIT_MESSAGE!" >nul 2>&1
    if errorlevel 1 (
        echo ❌ 提交失败
        exit /b 1
    )

    echo ℹ️  推送到远程仓库...
    git push origin !CURRENT_BRANCH! >nul 2>&1
    if errorlevel 1 (
        echo ❌ 代码推送失败
        exit /b 1
    ) else (
        echo ✅ 代码推送成功
    )
) else (
    echo ⚠️  没有检测到更改，跳过提交
)

REM Vercel 部署
echo.
echo ℹ️  开始 Vercel 部署...

REM 检查 Vercel CLI 是否安装
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI 未安装，请手动在 Vercel 仪表板中重新部署
    echo ℹ️  或者运行: npm install -g vercel 安装 Vercel CLI
) else (
    echo ℹ️  使用 Vercel CLI 部署...
    vercel --prod >nul 2>&1
    if errorlevel 1 (
        echo ❌ Vercel 部署失败
        exit /b 1
    ) else (
        echo ✅ Vercel 部署成功
    )
)

REM 显示部署信息
echo.
echo ✅ 部署流程完成！
echo.
echo 📋 下一步操作：
echo    1. 访问 Vercel 仪表板查看部署状态
echo    2. 检查部署日志确认构建成功
echo    3. 访问生成的 URL 验证应用运行
echo.
echo 🔗 有用的链接：
echo    - Vercel 仪表板: https://vercel.com
echo    - GitHub 仓库: https://github.com/stuboyfly/study-EN
echo.

endlocal