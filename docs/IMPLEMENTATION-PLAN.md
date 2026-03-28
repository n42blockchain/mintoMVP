# Minto Management MVP 实现计划

## Context
基于 PPT 设计稿（12页），实现 Minto Management 商户数字代币/积分/优惠券管理平台的 MVP 版本。项目为全新空仓库，需从零搭建前后端。

---

## 技术栈
- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **后端**: Next.js API Routes（单体应用，适合 MVP 快速迭代）
- **数据库**: SQLite（开发）/ PostgreSQL（生产），Prisma ORM
- **认证**: NextAuth.js (Auth.js v5) Credentials Provider
- **表单**: react-hook-form + zod 校验
- **图标**: lucide-react

---

## 数据库模型

| 模型 | 关键字段 | 说明 |
|------|---------|------|
| **User** | email, passwordHash, merchantId | 登录用户，关联商户 |
| **Merchant** | name, logo, plan(Basic/Standard/Pro), status, serviceCode, 各项限额和用量 | 商户 |
| **Token** | name, type(CREDIT/COUPON/FLYER/MEMBERSHIP/GIFT_CARD/CUSTOM), totalMinted, distributed, recycled | 代币类型 |
| **Wallet** | name, address(0x...), type(MASTER/MANAGER/RECEIVER/CASHIER), status, holder, email, contact, passwordHash | 钱包 |
| **WalletBalance** | walletId, tokenId, balance | 钱包-代币余额（多对多） |
| **Transfer** | sourceWalletId, targetWalletId, tokenId, amount, status, DID 信息 | 转账记录 |

关键设计：
- WalletBalance 为独立表，支持每个钱包持有任意多种代币
- Transfer 使用 Prisma `$transaction` 原子操作，确保余额一致性
- Master Wallet 随商户自动创建，不可删除

---

## API 端点

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/merchant` | 获取商户信息+用量统计 |
| GET | `/api/tokens` | 代币列表 |
| POST | `/api/tokens` | 铸造新代币类型 |
| GET | `/api/tokens/stats` | 代币聚合统计 |
| GET/PUT/DELETE | `/api/tokens/[id]` | 单个代币 CRUD |
| GET | `/api/wallets` | 钱包列表 |
| POST | `/api/wallets` | 创建子钱包 |
| GET/PUT/DELETE | `/api/wallets/[id]` | 单个钱包 CRUD |
| GET | `/api/wallets/[id]/transfers` | 钱包转账历史 |
| POST | `/api/wallets/transfer` | 执行转账（原子操作） |
| POST | `/api/airdrop` | 批量空投 |

---

## 页面结构（对应 PPT 设计）

```
src/app/
├── (auth)/login/page.tsx              # 登录页
├── (dashboard)/layout.tsx             # Sidebar + Topbar 壳
│   ├── home/page.tsx                  # 0.0 首页仪表盘
│   ├── token/
│   │   ├── page.tsx                   # 1.0 代币概览
│   │   └── create/page.tsx            # 1.1 创建代币
│   ├── wallet/
│   │   ├── page.tsx                   # 2.0 钱包概览
│   │   ├── management/page.tsx        # 2.1 钱包管理表格
│   │   └── [id]/page.tsx              # 2.1.1 钱包详情+转账
│   ├── marketing/
│   │   ├── page.tsx                   # 3.0 营销工具
│   │   ├── airdrop/page.tsx           # 3.1 空投
│   │   ├── customers/page.tsx         # 我的客户(占位)
│   │   └── analytics/page.tsx         # 分析(占位)
│   └── settings/page.tsx              # 设置(占位)
```

---

## 共享组件

| 组件 | 文件 | 复用场景 |
|------|------|---------|
| Sidebar | `components/layout/sidebar.tsx` | 所有dashboard页 |
| Topbar | `components/layout/topbar.tsx` | 所有dashboard页 |
| MerchantInfoCard | `components/dashboard/merchant-info-card.tsx` | 首页 |
| UsageStats | `components/dashboard/usage-stats.tsx` | 首页 |
| TokenStatsCard | `components/token/token-stats-card.tsx` | 代币概览 |
| TokenTypeGrid | `components/token/token-type-grid.tsx` | 创建代币 |
| WalletCard | `components/wallet/wallet-card.tsx` | 钱包概览 |
| WalletTable | `components/wallet/wallet-table.tsx` | 钱包管理 |
| **WalletFormDialog** | `components/wallet/wallet-form-dialog.tsx` | **创建+编辑共用** (PPT 2.0.1 & 2.1.2) |
| TransferDialog | `components/wallet/transfer-dialog.tsx` | 钱包详情、转账 |
| TransferHistoryTable | `components/wallet/transfer-history-table.tsx` | 钱包详情 |

---

## 实现阶段

### Phase 1: 项目脚手架
- 初始化 Next.js 14 + TypeScript + Tailwind CSS
- 安装配置 shadcn/ui 组件库（button, card, dialog, table, dropdown-menu, input, select, badge, progress, form, toast）
- 编写 Prisma schema，运行迁移
- 创建 seed 脚本（demo 商户、master 钱包、示例代币和余额）
- 配置 NextAuth + 环境变量

### Phase 2: 布局壳 + 认证
- 实现 Sidebar（导航菜单+图标+路由高亮）
- 实现 Topbar（商户名+logo+语言切换+登出）
- Dashboard layout 包裹所有子页面
- 登录页 + NextAuth middleware 保护

### Phase 3: 首页仪表盘
- GET /api/merchant 端点
- MerchantInfoCard（状态徽章、日期、服务码）
- UsageStats（3个进度条：铸造/交易/代币类型）
- QuickActions（3个快捷按钮）

### Phase 4: 代币模块
- 代币 API 端点（CRUD + stats）
- 1.0 代币概览页（统计卡片 + 操作按钮）
- 1.1 创建代币页（6卡片网格 + 创建表单对话框）

### Phase 5: 钱包 CRUD
- 钱包 API 端点（CRUD）
- 2.0 钱包概览页（Master + Sub-Wallet 卡片）
- 2.1 钱包管理表格页
- WalletFormDialog（创建/编辑两种模式）
- 删除确认对话框（Master 钱包禁止删除）

### Phase 6: 转账 + 钱包详情
- POST /api/wallets/transfer（原子事务：扣减源余额、增加目标余额、创建记录）
- GET /api/wallets/[id]/transfers（分页）
- 2.1.1 钱包详情页（余额 + 转账历史）
- TransferDialog + TransferHistoryTable

### Phase 7: 营销工具 + 收尾
- 3.0 营销工具概览（3功能卡片）
- 3.1 空投页面 + API
- 加载状态、错误处理、Toast 通知
- 响应式适配

---

## 验证方式

1. **认证流程**: 登录 → 进入仪表盘 → 登出 → 重定向回登录页
2. **仪表盘**: 商户信息和用量统计正确显示
3. **代币**: 创建 Credit 类型代币 → 概览页统计更新 → 仪表盘铸造用量+1
4. **钱包**: 创建子钱包 → 管理表格中出现 → 编辑名称 → 删除 → 消失；Master 钱包不可删除
5. **转账**: 从 Master 转 500 Credit 到子钱包 → 源余额-500、目标余额+500 → 转账历史出现记录 → 交易计数+1
6. **边界**: 超额转账报错、密码不一致报错、超出套餐限额报错

---

## 关键文件
- `prisma/schema.prisma` — 数据库 schema
- `src/app/(dashboard)/layout.tsx` — dashboard 布局壳
- `src/app/api/wallets/transfer/route.ts` — 转账核心逻辑（最复杂）
- `src/components/wallet/wallet-form-dialog.tsx` — 钱包创建/编辑共用对话框
- `src/lib/auth.ts` — NextAuth 配置
