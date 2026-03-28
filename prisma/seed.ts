import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create merchant
  const merchant = await prisma.merchant.create({
    data: {
      name: "Gyumanor Shop",
      plan: "STANDARD",
      status: "ACTIVE",
      registrationDate: new Date("2026-03-26"),
      expireDate: new Date("2027-03-25"),
      serviceCode: "00017",
      mintingLimit: 10000,
      transactionLimit: 100000,
      tokenTypeLimit: 10,
      mintingUsed: 405,
      transactionUsed: 8920,
    },
  });

  // Create admin user
  const passwordHash = await hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@minto.com",
      passwordHash,
      name: "Admin",
      merchantId: merchant.id,
    },
  });

  // Create tokens
  const credit = await prisma.token.create({
    data: {
      name: "Credit",
      type: "CREDIT",
      totalMinted: 375,
      distributed: 300,
      recycled: 50,
      description: "Store money for prepaid card or gift card",
      merchantId: merchant.id,
    },
  });

  const coupon1 = await prisma.token.create({
    data: {
      name: "Coupon",
      type: "COUPON",
      totalMinted: 30,
      distributed: 12,
      recycled: 10,
      description: "Coupons for special products or promotion",
      merchantId: merchant.id,
    },
  });

  const flyer = await prisma.token.create({
    data: {
      name: "Flyer",
      type: "FLYER",
      totalMinted: 500,
      distributed: 200,
      recycled: 0,
      description: "Non-transferable and automatically expired advertisements",
      merchantId: merchant.id,
    },
  });

  // Create wallets
  const masterWallet = await prisma.wallet.create({
    data: {
      name: "Gyumanor",
      address: "0xdfrgsdfgdsg566dfg1a2b3c4d5e6f",
      type: "MASTER",
      status: "ACTIVE",
      holder: "Gyumanor Shop",
      merchantId: merchant.id,
    },
  });

  const managerWallet = await prisma.wallet.create({
    data: {
      name: "ServiceCtr",
      address: "0xsdfdsggdsg566dfg7a8b9c0d1e2f",
      type: "MANAGER",
      status: "ACTIVE",
      email: "service@gyumanor.com",
      holder: "Kevin Kou",
      contact: "6471234567",
      merchantId: merchant.id,
    },
  });

  const cashierWallet = await prisma.wallet.create({
    data: {
      name: "Emily",
      address: "0xdffdsggdsg566dfg3a4b5c6d7e8f",
      type: "CASHIER",
      status: "ACTIVE",
      holder: "Emily Chen",
      contact: "6479876543",
      merchantId: merchant.id,
    },
  });

  // Create wallet balances
  await prisma.walletBalance.createMany({
    data: [
      { walletId: masterWallet.id, tokenId: credit.id, balance: 78990 },
      { walletId: masterWallet.id, tokenId: coupon1.id, balance: 89 },
      { walletId: masterWallet.id, tokenId: flyer.id, balance: 500 },
      { walletId: managerWallet.id, tokenId: credit.id, balance: 0 },
      { walletId: managerWallet.id, tokenId: coupon1.id, balance: 100 },
      { walletId: managerWallet.id, tokenId: flyer.id, balance: 0 },
      { walletId: cashierWallet.id, tokenId: credit.id, balance: 345 },
      { walletId: cashierWallet.id, tokenId: coupon1.id, balance: 5 },
      { walletId: cashierWallet.id, tokenId: flyer.id, balance: 1 },
    ],
  });

  // Create sample transfers
  await prisma.transfer.createMany({
    data: [
      {
        sourceWalletId: masterWallet.id,
        targetWalletId: cashierWallet.id,
        tokenId: credit.id,
        amount: 8000,
        status: "COMPLETED",
        createdAt: new Date("2026-03-24"),
      },
      {
        sourceWalletId: masterWallet.id,
        targetWalletId: managerWallet.id,
        tokenId: credit.id,
        amount: 510,
        status: "COMPLETED",
        createdAt: new Date("2026-03-21"),
      },
      {
        sourceWalletId: masterWallet.id,
        targetWalletId: cashierWallet.id,
        tokenId: coupon1.id,
        amount: 700,
        status: "COMPLETED",
        createdAt: new Date("2026-03-13"),
      },
      {
        sourceWalletId: masterWallet.id,
        targetWalletId: managerWallet.id,
        tokenId: flyer.id,
        amount: 50,
        status: "COMPLETED",
        createdAt: new Date("2026-03-03"),
      },
      {
        sourceWalletId: masterWallet.id,
        targetWalletId: cashierWallet.id,
        tokenId: credit.id,
        amount: 6000,
        status: "COMPLETED",
        createdAt: new Date("2026-02-26"),
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
