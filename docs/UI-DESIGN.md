# Minto Management UI Design Analysis

Based on `minto management.pptx` (12 slides)

---

## Common Layout

### Left Sidebar
- **minto** logo (top)
- Home
- Token
  - Create
  - Management
- Wallet
  - Wallet management
- Marketing tools
  - Air drop
  - My customer
  - Analytics
- Settings (bottom, with gear icon)

### Top Bar
- Merchant logo + Merchant name (left)
- Languages switcher (right)
- Sign out button (right)

### Bottom Section
- Tutorials / Case studies links

---

## Page 0.0 - Home (Dashboard)

**Merchant Info Card:**
- Status: Basic / Standard / Pro / Suspended
- Registration date: 2026 03 26
- Expire date: 2027 03 25
- Client service code: 00017

**Usage Stats:**
- Minting usage: 375 / 10,000
- Transaction usage: 8,920 / 100,000
- Token types: 3 / 10

**Quick Actions (3 large rounded buttons):**
1. Create credits
2. Manage wallets
3. Marketing Tools

**Bottom:** Tutorials section

---

## Page 1.0 - Token Overview

**Stats Cards:**
- Credit: Total minted: 375, Distributed: 300/375, Recycled: 50/300
- Coupon: Total minted: 30, Distributed: 12/30, Recycled: 10/12

**Action Buttons (4 rounded cards):**
1. Create Credits
2. Create Coupons
3. Create Flyers
4. Create Membership cards

**Bottom:** Case studies & Tutorials

---

## Page 1.1 - Token Create (Mint)

**Section Title:** Create / Mint

**6-Card Grid:**
1. **Create Credits** - Store money for prepaid card or gift card
2. **Create Coupons** - Coupons for special products or promotion
3. **Create Flyers** - Non-transferable and automatically expired advertisements
4. **Create Membership cards**
5. **Create Gift Card**
6. **Customize**

---

## Page 2.0 - Wallet Overview

**Wallet Cards (horizontal layout):**

| Master Wallet: XX Shop | Sub-Wallet: Department | Sub-Wallet: Cashier 1 |
|------------------------|------------------------|-----------------------|
| Token1: 2,400,600      | Token1: 0              | Token1: 345           |
| Token2: 175            | Token2: 100            | Token2: 5             |
| Token3: 23             | Token3: 0              | Token3: 1             |

Each column has a **"+ New Sub-Wallet"** button below.

**Notes:**
- Wallets auto-generated on creation, cannot be deleted
- Sub-wallets linked to subscription plan
- Existing wallets show info
- Unfilled wallets shown as cards

**Navigation arrows to:** 2.1 Wallet management, 2.0.1 New Wallet

---

## Page 2.0.1 - New Wallet (Modal Dialog)

**Dialog Title:** New Wallet / Create Sub-Wallet

**Form Fields:**
- Name: (e.g. "Cashier 02")
- Type: Dropdown - Manager / Receiver
- Set PW: Password field
- Confirm password
- Email: Email field
- Holder: (e.g. "John Wang")
- Contact: (e.g. "647XXXXX")

**Buttons:** Confirm | Cancel

---

## Page 2.1 - Wallet Management (Table)

**Table Columns:**

| Name | Wallet add. | Type | Status | Created time | Action |
|------|-------------|------|--------|--------------|--------|
| Gyumanor | 0xdfrgsdfgdsg566dfg | Master | Active | 2026 03 24 | Detail Edit Transfer |
| ServiceCtr | 0xsdfdsggdsg566dfg | Manager | Active | 2026 03 25 | Detail Edit Transfer Delete |
| Emily | 0xdffdsggdsg566dfg | Cashier | Active | 2026 03 25 | Detail Edit Transfer Delete |

**Note:** Master wallet has no Delete action.

**Button:** New sub-wallet

---

## Page 2.1.1 - Wallet Detail

**Header:** Wallet name (e.g. "Gyumanor") + Edit / Transfer buttons

**Token Balances:**
- Credit: 78,990
- Coupon1: 89
- Coupon2: 67
- Flyer: 500

**Transfer History Table:**

| ID | Token Type | Status | Amount | Time | Advanced |
|----|-----------|--------|--------|------|----------|
| XXXXX | Credit | Success | 8,000 | 2026 03 24 | (DID, Handle, Target DID, Target handle) |
| XXXXX | Credit | Success | 510 | 2026 03 21 | |
| XXXXX | Coupon | Success | 700 | 2026 03 13 | |
| XXXXX | Flyer | Success | 50 | 2026 03 03 | |
| XXXXX | Credit | Success | 6,000 | 2026 02 26 | |

---

## Page 2.1.2 - Wallet Edit (Modal Dialog)

**Same table view as 2.1** with an overlay dialog.

**Dialog Title:** Wallet

**Form Fields (pre-filled):**
- Name: (e.g. "ServiceCtr")
- Type: Dropdown (e.g. "Manager")
- Set PW: *******
- Confirm password
- Email: (e.g. "adfaf@dgd.com")
- Holder: (e.g. "Kevin Kou")
- Contact: (e.g. "647XXXXX")

**Buttons:** Confirm | Cancel

---

## Page 2.1.3 - Wallet Token Transfer

**Header:** Wallet name (e.g. "Gyumanor")

**Token Balances with Transfer buttons:**
- Credit: 78,990 → Transfer
- Coupon1: 89 → Transfer
- Coupon2: 67 → Transfer
- Flyer: 500 → Transfer

**Transfer Dialog (overlay):**
- Token type selection
- Target wallet selection
- Amount input
- Confirm / Cancel

**Below:** Transfer History

---

## Page 3.0 - Marketing Tools

**3 Feature Cards:**
1. **Air Drop** - Send flyers or coupons directly to the customer
2. **My Customer**
3. **Analytics**

---

## Page 3.1 - Marketing Tools: Air Drop

Air drop management page (details TBD in MVP - basic form for selecting token type, target wallets, and amount)

---

## Design Patterns

- **Color scheme:** Clean corporate style, rounded cards
- **Navigation:** Left sidebar always visible, active item highlighted
- **Modals:** Used for create/edit wallet forms
- **Tables:** Used for wallet management and transfer history
- **Cards:** Used for dashboards, overviews, and feature selections
- **Progress bars:** Used for usage statistics
- **Badges:** Used for status indicators (Active, Basic/Standard/Pro)
