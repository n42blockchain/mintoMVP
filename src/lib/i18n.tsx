"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "en" | "zh-TW";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Sidebar nav
    "nav.home": "Home",
    "nav.token": "Token",
    "nav.token.create": "Create",
    "nav.token.management": "Management",
    "nav.wallet": "Wallet",
    "nav.wallet.management": "Wallet management",
    "nav.marketing": "Marketing tools",
    "nav.marketing.airdrop": "Air drop",
    "nav.marketing.customers": "My customer",
    "nav.marketing.analytics": "Analytics",
    "nav.settings": "Settings",

    // Topbar
    "topbar.languages": "Languages",
    "topbar.signout": "Sign out",

    // Login
    "login.subtitle": "Merchant Management Platform",
    "login.title": "Sign In",
    "login.email": "Email",
    "login.email.placeholder": "admin@minto.com",
    "login.password": "Password",
    "login.password.placeholder": "Enter password",
    "login.error": "Invalid email or password",
    "login.loading": "Signing in...",
    "login.submit": "Sign In",

    // Home
    "home.title": "Home",
    "home.regDate": "Registration date",
    "home.expDate": "Expire date",
    "home.serviceCode": "Service code",
    "home.usage": "Usage",
    "home.mintingUsage": "Minting usage",
    "home.txUsage": "Transaction usage",
    "home.tokenTypes": "Token types",
    "home.createCredits": "Create credits",
    "home.manageWallets": "Manage wallets",
    "home.marketingTools": "Marketing Tools",
    "home.tutorials": "Tutorials",
    "home.tutorials.desc": "Get started with Minto by exploring our guides and tutorials.",

    // Token Overview
    "token.title": "Token Overview",
    "token.empty": "No tokens yet. Create your first token to get started.",
    "token.createToken": "Create Token",
    "token.totalMinted": "Total minted",
    "token.distributed": "Distributed",
    "token.recycled": "Recycled",
    "token.createCredits": "Create Credits",
    "token.createCoupons": "Create Coupons",
    "token.createFlyers": "Create Flyers",
    "token.createMembership": "Create Membership cards",
    "token.tutorials": "Case studies & Tutorials",
    "token.tutorials.desc": "Learn how to effectively use tokens for your business.",

    // Token Create
    "tokenCreate.title": "Create / Mint",
    "tokenCreate.credits": "Create Credits",
    "tokenCreate.credits.desc": "Store money for prepaid card or gift card",
    "tokenCreate.coupons": "Create Coupons",
    "tokenCreate.coupons.desc": "Coupons for special products or promotion",
    "tokenCreate.flyers": "Create Flyers",
    "tokenCreate.flyers.desc": "Non-transferable and automatically expired advertisements",
    "tokenCreate.membership": "Create Membership cards",
    "tokenCreate.membership.desc": "Membership cards for loyal customers",
    "tokenCreate.giftCard": "Create Gift Card",
    "tokenCreate.giftCard.desc": "Gift cards for special occasions",
    "tokenCreate.custom": "Customize",
    "tokenCreate.custom.desc": "Create a custom token type",
    "tokenCreate.name": "Token Name",
    "tokenCreate.name.placeholder": "e.g. Store Credit",
    "tokenCreate.amount": "Initial Mint Amount",
    "tokenCreate.amount.placeholder": "e.g. 10000",
    "tokenCreate.desc": "Description (optional)",
    "tokenCreate.desc.placeholder": "Description",
    "tokenCreate.creating": "Creating...",
    "tokenCreate.error": "Failed to create token",
    "tokenCreate.tutorials": "Case studies & Tutorials",
    "tokenCreate.tutorials.desc": "Learn best practices for creating and managing tokens.",

    // Wallet Overview
    "wallet.title": "Wallet Overview",
    "wallet.management": "Wallet Management",
    "wallet.master": "Master Wallet",
    "wallet.sub": "Sub-Wallet",
    "wallet.noTokens": "No tokens yet",
    "wallet.newSub": "New Sub-Wallet",
    "wallet.tutorials": "Tutorials",
    "wallet.tutorials.desc": "Learn how to set up and manage your wallet hierarchy.",

    // Wallet Detail
    "walletDetail.address": "Address",
    "walletDetail.status": "Status",
    "walletDetail.holder": "Holder",
    "walletDetail.email": "Email",
    "walletDetail.contact": "Contact",
    "walletDetail.balances": "Token Balances",
    "walletDetail.noBalances": "No token balances",
    "walletDetail.transfer": "Transfer",
    "walletDetail.history": "Transfer History",
    "walletDetail.id": "ID",
    "walletDetail.token": "Token",
    "walletDetail.amount": "Amount",
    "walletDetail.fromTo": "From / To",
    "walletDetail.time": "Time",
    "walletDetail.noTransfers": "No transfers yet",
    "walletDetail.edit": "Edit",

    // Wallet Management
    "walletMgmt.title": "Wallet Management",
    "walletMgmt.newSub": "New sub-wallet",
    "walletMgmt.name": "Name",
    "walletMgmt.address": "Wallet Address",
    "walletMgmt.type": "Type",
    "walletMgmt.status": "Status",
    "walletMgmt.created": "Created",
    "walletMgmt.action": "Action",
    "walletMgmt.detail": "Detail",
    "walletMgmt.edit": "Edit",
    "walletMgmt.transfer": "Transfer",
    "walletMgmt.delete": "Delete",
    "walletMgmt.deleteTitle": "Delete Wallet",
    "walletMgmt.deleteConfirm": "Are you sure you want to delete wallet \"{name}\"? This action cannot be undone.",
    "walletMgmt.deleting": "Deleting...",

    // Wallet Form Dialog
    "walletForm.createTitle": "Create Sub-Wallet",
    "walletForm.editTitle": "Edit Wallet",
    "walletForm.createDesc": "Create a new sub-wallet for your team",
    "walletForm.editDesc": "Update wallet information",
    "walletForm.name": "Name",
    "walletForm.name.placeholder": "Wallet name",
    "walletForm.type": "Type",
    "walletForm.type.manager": "Manager",
    "walletForm.type.receiver": "Receiver",
    "walletForm.type.cashier": "Cashier",
    "walletForm.setPassword": "Set Password",
    "walletForm.newPassword": "New Password (leave blank to keep)",
    "walletForm.password.placeholder": "Password",
    "walletForm.confirmPassword": "Confirm Password",
    "walletForm.confirmPassword.placeholder": "Confirm password",
    "walletForm.email": "Email",
    "walletForm.email.placeholder": "Email address",
    "walletForm.holder": "Holder",
    "walletForm.holder.placeholder": "Holder name",
    "walletForm.contact": "Contact",
    "walletForm.contact.placeholder": "Contact number",
    "walletForm.passwordMismatch": "Passwords don't match",
    "walletForm.operationFailed": "Operation failed",
    "walletForm.saving": "Saving...",

    // Transfer Dialog
    "transferDialog.title": "Transfer {token}",
    "transferDialog.from": "From {wallet} (Balance: {balance})",
    "transferDialog.target": "Target Wallet",
    "transferDialog.target.placeholder": "Select wallet",
    "transferDialog.amount": "Amount",
    "transferDialog.amount.placeholder": "Enter amount",
    "transferDialog.insufficientBalance": "Insufficient balance",
    "transferDialog.failed": "Transfer failed",
    "transferDialog.transferring": "Transferring...",

    // Marketing
    "marketing.title": "Marketing Tools",
    "marketing.airdrop": "Air Drop",
    "marketing.airdrop.desc": "Send flyers or coupons directly to the customer",
    "marketing.customer": "My Customer",
    "marketing.customer.desc": "Manage your customer base and interactions",
    "marketing.analytics": "Analytics",
    "marketing.analytics.desc": "View insights and performance metrics",
    "marketing.tutorials": "Tutorials",
    "marketing.tutorials.desc": "Learn how to leverage marketing tools to grow your business.",

    // Airdrop
    "airdrop.title": "Air Drop",
    "airdrop.sendTitle": "Send tokens to multiple wallets",
    "airdrop.source": "Source Wallet",
    "airdrop.source.placeholder": "Select source wallet",
    "airdrop.token": "Token",
    "airdrop.token.placeholder": "Select token",
    "airdrop.amountPerWallet": "Amount per wallet",
    "airdrop.amountPerWallet.placeholder": "Amount to send to each wallet",
    "airdrop.targets": "Target Wallets ({count} selected)",
    "airdrop.noWallets": "No wallets available",
    "airdrop.failed": "Airdrop failed",
    "airdrop.success": "Successfully airdropped to {count} wallets!",
    "airdrop.sending": "Sending...",
    "airdrop.send": "Send Airdrop",

    // Customers
    "customers.title": "My Customer",
    "customers.comingSoon": "Coming Soon",
    "customers.desc": "Customer management features are being developed. You'll be able to manage your customer base and interactions here.",

    // Analytics
    "analytics.title": "Analytics",
    "analytics.comingSoon": "Coming Soon",
    "analytics.desc": "Analytics dashboard is being developed. You'll be able to view insights and performance metrics here.",

    // Settings
    "settings.title": "Settings",
    "settings.comingSoon": "Coming Soon",
    "settings.desc": "Settings page is being developed. You'll be able to configure your account and preferences here.",

    // Common
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.loading": "Loading...",
    "common.balance": "Balance",
  },
  "zh-TW": {
    // Sidebar nav
    "nav.home": "首頁",
    "nav.token": "代幣",
    "nav.token.create": "建立",
    "nav.token.management": "管理",
    "nav.wallet": "錢包",
    "nav.wallet.management": "錢包管理",
    "nav.marketing": "行銷工具",
    "nav.marketing.airdrop": "空投",
    "nav.marketing.customers": "我的客戶",
    "nav.marketing.analytics": "數據分析",
    "nav.settings": "設定",

    // Topbar
    "topbar.languages": "語言",
    "topbar.signout": "登出",

    // Login
    "login.subtitle": "商戶管理平台",
    "login.title": "登入",
    "login.email": "電子郵件",
    "login.email.placeholder": "admin@minto.com",
    "login.password": "密碼",
    "login.password.placeholder": "請輸入密碼",
    "login.error": "電子郵件或密碼錯誤",
    "login.loading": "登入中...",
    "login.submit": "登入",

    // Home
    "home.title": "首頁",
    "home.regDate": "註冊日期",
    "home.expDate": "到期日期",
    "home.serviceCode": "服務代碼",
    "home.usage": "用量統計",
    "home.mintingUsage": "鑄造用量",
    "home.txUsage": "交易用量",
    "home.tokenTypes": "代幣類型",
    "home.createCredits": "建立儲值",
    "home.manageWallets": "管理錢包",
    "home.marketingTools": "行銷工具",
    "home.tutorials": "教學指南",
    "home.tutorials.desc": "探索我們的指南和教學，快速上手 Minto。",

    // Token Overview
    "token.title": "代幣總覽",
    "token.empty": "尚無代幣。建立您的第一個代幣以開始使用。",
    "token.createToken": "建立代幣",
    "token.totalMinted": "鑄造總量",
    "token.distributed": "已分發",
    "token.recycled": "已回收",
    "token.createCredits": "建立儲值",
    "token.createCoupons": "建立優惠券",
    "token.createFlyers": "建立傳單",
    "token.createMembership": "建立會員卡",
    "token.tutorials": "案例研究與教學",
    "token.tutorials.desc": "了解如何有效地為您的業務運用代幣。",

    // Token Create
    "tokenCreate.title": "建立 / 鑄造",
    "tokenCreate.credits": "建立儲值",
    "tokenCreate.credits.desc": "儲值用於預付卡或禮品卡",
    "tokenCreate.coupons": "建立優惠券",
    "tokenCreate.coupons.desc": "用於特定商品或促銷活動的優惠券",
    "tokenCreate.flyers": "建立傳單",
    "tokenCreate.flyers.desc": "不可轉讓且自動過期的廣告",
    "tokenCreate.membership": "建立會員卡",
    "tokenCreate.membership.desc": "為忠實客戶提供的會員卡",
    "tokenCreate.giftCard": "建立禮品卡",
    "tokenCreate.giftCard.desc": "適用於特殊場合的禮品卡",
    "tokenCreate.custom": "自訂",
    "tokenCreate.custom.desc": "建立自訂代幣類型",
    "tokenCreate.name": "代幣名稱",
    "tokenCreate.name.placeholder": "例如：商店儲值",
    "tokenCreate.amount": "初始鑄造數量",
    "tokenCreate.amount.placeholder": "例如：10000",
    "tokenCreate.desc": "描述（選填）",
    "tokenCreate.desc.placeholder": "描述",
    "tokenCreate.creating": "建立中...",
    "tokenCreate.error": "建立代幣失敗",
    "tokenCreate.tutorials": "案例研究與教學",
    "tokenCreate.tutorials.desc": "了解建立和管理代幣的最佳實踐。",

    // Wallet Overview
    "wallet.title": "錢包總覽",
    "wallet.management": "錢包管理",
    "wallet.master": "主錢包",
    "wallet.sub": "子錢包",
    "wallet.noTokens": "尚無代幣",
    "wallet.newSub": "新增子錢包",
    "wallet.tutorials": "教學指南",
    "wallet.tutorials.desc": "了解如何設定和管理您的錢包層級結構。",

    // Wallet Detail
    "walletDetail.address": "地址",
    "walletDetail.status": "狀態",
    "walletDetail.holder": "持有人",
    "walletDetail.email": "電子郵件",
    "walletDetail.contact": "聯絡方式",
    "walletDetail.balances": "代幣餘額",
    "walletDetail.noBalances": "無代幣餘額",
    "walletDetail.transfer": "轉帳",
    "walletDetail.history": "轉帳紀錄",
    "walletDetail.id": "編號",
    "walletDetail.token": "代幣",
    "walletDetail.amount": "金額",
    "walletDetail.fromTo": "來源 / 目標",
    "walletDetail.time": "時間",
    "walletDetail.noTransfers": "尚無轉帳紀錄",
    "walletDetail.edit": "編輯",

    // Wallet Management
    "walletMgmt.title": "錢包管理",
    "walletMgmt.newSub": "新增子錢包",
    "walletMgmt.name": "名稱",
    "walletMgmt.address": "錢包地址",
    "walletMgmt.type": "類型",
    "walletMgmt.status": "狀態",
    "walletMgmt.created": "建立日期",
    "walletMgmt.action": "操作",
    "walletMgmt.detail": "詳情",
    "walletMgmt.edit": "編輯",
    "walletMgmt.transfer": "轉帳",
    "walletMgmt.delete": "刪除",
    "walletMgmt.deleteTitle": "刪除錢包",
    "walletMgmt.deleteConfirm": "確定要刪除錢包「{name}」嗎？此操作無法復原。",
    "walletMgmt.deleting": "刪除中...",

    // Wallet Form Dialog
    "walletForm.createTitle": "建立子錢包",
    "walletForm.editTitle": "編輯錢包",
    "walletForm.createDesc": "為您的團隊建立新的子錢包",
    "walletForm.editDesc": "更新錢包資訊",
    "walletForm.name": "名稱",
    "walletForm.name.placeholder": "錢包名稱",
    "walletForm.type": "類型",
    "walletForm.type.manager": "管理員",
    "walletForm.type.receiver": "接收者",
    "walletForm.type.cashier": "收銀員",
    "walletForm.setPassword": "設定密碼",
    "walletForm.newPassword": "新密碼（留空保持不變）",
    "walletForm.password.placeholder": "密碼",
    "walletForm.confirmPassword": "確認密碼",
    "walletForm.confirmPassword.placeholder": "確認密碼",
    "walletForm.email": "電子郵件",
    "walletForm.email.placeholder": "電子郵件地址",
    "walletForm.holder": "持有人",
    "walletForm.holder.placeholder": "持有人姓名",
    "walletForm.contact": "聯絡方式",
    "walletForm.contact.placeholder": "聯絡電話",
    "walletForm.passwordMismatch": "密碼不一致",
    "walletForm.operationFailed": "操作失敗",
    "walletForm.saving": "儲存中...",

    // Transfer Dialog
    "transferDialog.title": "轉帳 {token}",
    "transferDialog.from": "從 {wallet}（餘額：{balance}）",
    "transferDialog.target": "目標錢包",
    "transferDialog.target.placeholder": "選擇錢包",
    "transferDialog.amount": "金額",
    "transferDialog.amount.placeholder": "輸入金額",
    "transferDialog.insufficientBalance": "餘額不足",
    "transferDialog.failed": "轉帳失敗",
    "transferDialog.transferring": "轉帳中...",

    // Marketing
    "marketing.title": "行銷工具",
    "marketing.airdrop": "空投",
    "marketing.airdrop.desc": "直接向客戶發送傳單或優惠券",
    "marketing.customer": "我的客戶",
    "marketing.customer.desc": "管理您的客戶群和互動",
    "marketing.analytics": "數據分析",
    "marketing.analytics.desc": "查看洞察和績效指標",
    "marketing.tutorials": "教學指南",
    "marketing.tutorials.desc": "了解如何利用行銷工具拓展您的業務。",

    // Airdrop
    "airdrop.title": "空投",
    "airdrop.sendTitle": "向多個錢包發送代幣",
    "airdrop.source": "來源錢包",
    "airdrop.source.placeholder": "選擇來源錢包",
    "airdrop.token": "代幣",
    "airdrop.token.placeholder": "選擇代幣",
    "airdrop.amountPerWallet": "每個錢包的數量",
    "airdrop.amountPerWallet.placeholder": "發送至每個錢包的數量",
    "airdrop.targets": "目標錢包（已選擇 {count} 個）",
    "airdrop.noWallets": "無可用錢包",
    "airdrop.failed": "空投失敗",
    "airdrop.success": "成功空投至 {count} 個錢包！",
    "airdrop.sending": "發送中...",
    "airdrop.send": "發送空投",

    // Customers
    "customers.title": "我的客戶",
    "customers.comingSoon": "即將推出",
    "customers.desc": "客戶管理功能正在開發中。您將可以在此管理您的客戶群和互動。",

    // Analytics
    "analytics.title": "數據分析",
    "analytics.comingSoon": "即將推出",
    "analytics.desc": "數據分析儀表板正在開發中。您將可以在此查看洞察和績效指標。",

    // Settings
    "settings.title": "設定",
    "settings.comingSoon": "即將推出",
    "settings.desc": "設定頁面正在開發中。您將可以在此配置您的帳戶和偏好設定。",

    // Common
    "common.cancel": "取消",
    "common.confirm": "確認",
    "common.delete": "刪除",
    "common.loading": "載入中...",
    "common.balance": "餘額",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("minto-locale") as Locale;
    if (saved && (saved === "en" || saved === "zh-TW")) {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem("minto-locale", newLocale);
  }

  function t(key: string, params?: Record<string, string | number>): string {
    let text = translations[locale]?.[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
