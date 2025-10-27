#!/bin/bash

# 部署脚本 - Vercel 自动化部署
# 作者: Claude Code
# 描述: 自动构建、提交并部署到 Vercel

set -e  # 遇到错误立即退出

echo "🚀 开始部署流程..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."

    if ! command -v git &> /dev/null; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi

    log_success "所有依赖检查通过"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."

    # 安装依赖
    log_info "安装项目依赖..."
    if npm install; then
        log_success "依赖安装成功"
    else
        log_error "依赖安装失败"
        exit 1
    fi

    # 构建项目
    log_info "构建生产版本..."
    if npm run build; then
        log_success "项目构建成功"
    else
        log_error "项目构建失败"
        exit 1
    fi
}

# 代码质量检查
check_code_quality() {
    log_info "检查代码质量..."

    # TypeScript 类型检查
    if npx tsc --noEmit; then
        log_success "TypeScript 类型检查通过"
    else
        log_error "TypeScript 类型检查失败"
        exit 1
    fi

    # ESLint 检查
    if npm run lint; then
        log_success "ESLint 检查通过"
    else
        log_warning "ESLint 检查发现问题，但继续部署..."
    fi
}

# Git 操作
git_operations() {
    log_info "执行 Git 操作..."

    # 检查 Git 状态
    if ! git status &> /dev/null; then
        log_error "当前目录不是 Git 仓库"
        exit 1
    fi

    # 获取当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "当前分支: $CURRENT_BRANCH"

    # 添加所有更改
    log_info "添加文件到暂存区..."
    git add .

    # 检查是否有更改
    if git diff-index --quiet HEAD --; then
        log_warning "没有检测到更改，跳过提交"
        return 0
    fi

    # 提交更改
    COMMIT_MESSAGE="chore: deploy $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "提交更改: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"

    # 推送到远程
    log_info "推送到远程仓库..."
    if git push origin "$CURRENT_BRANCH"; then
        log_success "代码推送成功"
    else
        log_error "代码推送失败"
        exit 1
    fi
}

# Vercel 部署部署
vercel_deploy() {
    log_info "开始 Vercel 部署..."

    # 检查 Vercel CLI 是否安装
    if command -v vercel &> /dev/null; then
        log_info "使用 Vercel CLI 部署..."
        if vercel --prod; then
            log_success "Vercel 部署成功"
        else
            log_error "Vercel 部署失败"
            exit 1
        fi
    else
        log_warning "Vercel CLI 未安装，请手动在 Vercel 仪表板中重新部署"
        log_info "或者运行: npm install -g vercel 安装 Vercel CLI"
    fi
}

# 显示部署信息
show_deployment_info() {
    log_success "🎉 部署流程完成！"
    echo ""
    echo "📋 下一步操作："
    echo "   1. 访问 Vercel 仪表板查看部署状态"
    echo "   2. 检查部署日志确认构建成功"
    echo "   3. 访问生成的 URL 验证应用运行"
    echo ""
    echo "🔗 有用的链接："
    echo "   - Vercel 仪表板: https://vercel.com"
    echo "   - GitHub 仓库: https://github.com/stuboyfly/study-EN"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "========================================"
    echo "        Vercel 自动化部署脚本"
    echo "========================================"
    echo ""

    # 执行部署流程
    check_dependencies
    check_code_quality
    build_project
    git_operations
    vercel_deploy
    show_deployment_info
}

# 处理命令行参数
case "${1:-}" in
    "--help" | "-h")
        echo "使用方法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  --help, -h     显示帮助信息"
        echo "  --build-only   仅构建项目，不提交和部署"
        echo "  --git-only     仅执行 Git 操作"
        echo "  --deploy-only  仅执行 Vercel 部署"
        echo ""
        exit 0
        ;;
    "--build-only")
        check_dependencies
        build_project
        exit 0
        ;;
    "--git-only")
        git_operations
        exit 0
        ;;
    "--deploy-only")
        vercel_deploy
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "未知选项: $1"
        echo "使用 --help 查看可用选项"
        exit 1
        ;;
esac