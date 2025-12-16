# QuickStock Admin Module - Quick Reference

## 🎯 At a Glance

### Login Flow (NEW!)
**Admins** (emails ending with `@admin.com`):
- Login → Redirected to `/admin-dashboard`
- See comprehensive Admin Dashboard Overview first
- 8 tabs with full control center

**Regular Users** (all other emails):
- Login → Redirected to `/dashboard`
- See standard user dashboard
- Access to sales, inventory, expenses, customers, reports

### What Admin Sees First (Dashboard Tab):
```
📊 Welcome Back, Admin! 👋
   Tuesday, December 16, 2025

┌─────────────────────────────────────────────────────────┐
│  🏢 3 Branches  👥 12 Staff  💰 450K Sales  📈 325K Profit│
└─────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  🛒 47 Transactions  📦 1,050K Inventory  👤 446 Customers│
│  ⚠️ 16 Low Stock Items                                  │
└────────────────────────────────────────────────────────┘

┌─ Important Alerts ─────────────────────────────────────┐
│  ⚠️ 16 items low on stock - Restock needed            │
│  💳 368K XAF outstanding debt - Follow up needed       │
│  📈 Sales up 12.5% - Compared to last week            │
└────────────────────────────────────────────────────────┘

┌─ Weekly Performance Chart ─────────────────────────────┐
│  [Area Chart: Sales & Profit Trends]                   │
└────────────────────────────────────────────────────────┘

┌─ Top Performing Branches ──────────────────────────────┐
│  🥇 Market Branch - 1,450K sales (+15.2%)              │
│  🥈 Main Branch - 1,250K sales (+12.8%)                │
│  🥉 Downtown Branch - 980K sales (+8.5%)               │
└────────────────────────────────────────────────────────┘

┌─ Recent Activity ──────────────────────────────────────┐
│  🏢 New branch created - 2 hours ago                   │
│  ✅ Staff member added - 4 hours ago                   │
│  ⚠️ Large expense recorded - 6 hours ago               │
└────────────────────────────────────────────────────────┘

┌─ Quick Actions ────────────────────────────────────────┐
│  [Add Branch] [Add Staff] [View Analytics] [Settings]  │
└────────────────────────────────────────────────────────┘
```

## 🏢 Branch Management

**Actions:**
- ➕ Add Branch
- ✏️ Edit Branch
- 🗑️ Delete Branch
- 🔍 Search Branches
- 🔧 Filter by Status

**Required Fields:**
- Branch Name
- Location
- Manager Name
- Phone Number
- Email Address
- Status (Active/Inactive)

**Example:**
```
Branch: Market Branch
Location: Douala, Cameroon
Manager: John Doe
Phone: +237 6 XX XX XX XX
Email: market@quickstock.cm
Status: Active
```

## 👥 Staff Management

**Roles Available:**
1. **Manager** 🟣 - Full access
2. **Cashier** 🔵 - Sales & customers only
3. **Inventory Manager** 🟢 - Inventory & reports
4. **Sales Rep** 🟠 - Sales, reports & customers

**Permissions:**
- ✅ Make Sales
- ✅ Add Expenses
- ✅ Manage Inventory
- ✅ View Reports
- ✅ Manage Customers
- ✅ Delete Records

**Quick Add:**
1. Click "Add Staff Member"
2. Enter name, email, phone
3. Select role (auto-applies permissions)
4. Customize permissions if needed
5. Save

## 📊 Branch Analytics

**What You See:**
- Total sales across all branches
- Total expenses across all branches
- Net profit calculations
- Inventory value
- Low stock items count
- Customer counts
- Outstanding debt
- Top performing branch

**Charts:**
- Bar Chart: Sales, Expenses, Profit comparison
- Pie Chart: Sales distribution by branch

**Branch Cards:**
- Sales amount
- Profit amount
- Customer count
- Transaction count
- Low stock alerts
- Top selling item

## ⚙️ System Settings

**Categories:**

### Branch Settings
- ☑️ Enable Multiple Branches

### Financial Settings
- Currency: XAF, USD, EUR, GBP
- ☑️ Enable Tax
- Tax Rate: 0-100%

### Approval Settings
- ☑️ Require Expense Approval
- Approval Limit: Amount threshold

### Alert Settings
- ☑️ Low Stock Alerts

### Receipt Settings
- Footer Text: Custom message

### Appearance
- Primary Color: Color picker + presets

**Important:**
- Click "Save Changes" to apply
- "Reset" button restores defaults
- Orange warning for unsaved changes

## 🔐 Access Control

**Admin Users (@admin.com):**
- See ALL 8 tabs
- Can manage branches
- Can manage staff
- Can change settings
- Full system access

**Regular Users:**
- Standard dashboard only
- No admin tabs visible
- Limited permissions

## 📱 Mobile View

**Tabs Show:**
- Desktop: Icon + Text
- Mobile: Icon only

**Layouts:**
- Desktop: 2-3 column grids
- Tablet: 2 column grids
- Mobile: 1 column grids

## 🎨 Color Guide

**Status Indicators:**
- 🟢 Green = Active, Success, Profit, Sales
- 🔴 Red = Inactive, Error, Delete, Expenses
- 🟠 Orange = Warning, Low Stock, Alerts
- 🔵 Blue = Info, General, Branches
- 🟣 Purple = Premium, Managers, Staff
- ⚪ Gray = Neutral, Disabled

**Role Colors:**
- 🟣 Purple = Manager
- 🔵 Blue = Cashier
- 🟢 Green = Inventory Manager
- 🟠 Orange = Sales Rep

## ⚡ Quick Actions

**From Dashboard:**
1. Add Branch → Opens branch dialog
2. Add Staff → Opens staff dialog
3. View Analytics → Switches to analytics tab
4. System Settings → Switches to settings tab

**From Any Tab:**
- Search: Instant filter
- Add: Opens creation dialog
- Edit: Opens with pre-filled data
- Delete: Confirmation required

## 📊 Metrics Explained

**Sales:** Total revenue from all transactions
**Expenses:** Total costs and expenses
**Profit:** Sales - Expenses
**Inventory Value:** Current stock worth
**Low Stock:** Items below threshold
**Debt:** Outstanding customer balances
**Transactions:** Number of sales made
**Growth %:** Compared to previous period

## 🚀 Pro Tips

1. **Default View:** Dashboard shows on login
2. **Quick Search:** Use search boxes to filter instantly
3. **Role Templates:** Select role to auto-set permissions
4. **Color Themes:** Use preset colors for quick branding
5. **Validation:** Red borders indicate required fields
6. **Toast Messages:** Success/error notifications appear
7. **Empty States:** Helpful messages when no data
8. **Responsive:** Works on any device size

## 🎯 Common Tasks

**Add a New Branch:**
1. Click "Branches" tab
2. Click "Add Branch"
3. Fill all fields
4. Click "Create Branch"
✅ Done!

**Add a Staff Member:**
1. Click "Staff" tab
2. Click "Add Staff Member"
3. Enter details
4. Select role
5. Adjust permissions if needed
6. Click "Add Staff Member"
✅ Done!

**Compare Branch Performance:**
1. Click "Analytics" tab
2. View charts and metrics
3. See top performing branch
4. Review individual cards
✅ Done!

**Change System Currency:**
1. Click "Settings" tab
2. Find "Financial Settings"
3. Select currency dropdown
4. Choose currency
5. Click "Save Changes"
✅ Done!

---

**Need More Help?**
- See `/ADMIN_MODULE_GUIDE.md` for full documentation
- See `/ADMIN_REBUILD_SUMMARY.md` for technical details