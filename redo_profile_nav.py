with open('screens/MainApp.js', 'r') as f:
    content = f.read()

changes = 0

# 1. Rename Store tab to Profile in BottomNav tabs list
old1 = """    { id: 'orders',  icon: 'receipt-outline',     label: 'Orders' },
    { id: 'store',   icon: 'storefront-outline',  label: 'Store' },
  ];"""
new1 = """    { id: 'orders',  icon: 'receipt-outline',     label: 'Orders' },
    { id: 'profile', icon: 'person-outline',      label: 'Profile' },
  ];"""
if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("1/5: bottom nav tab renamed to Profile")
else:
    print("FAILED 1/5")

# 2. Change onChange to intercept the profile tab and open the full screen directly
old2 = """      <BottomNav
        active={tab}
        onChange={setTab}
        cartCount={cartCount}
        notifCount={unread}
      />"""
new2 = """      <BottomNav
        active={tab}
        onChange={(id) => {
          if (id === 'profile') { setShowProfile(true); return; }
          setTab(id);
        }}
        cartCount={cartCount}
        notifCount={unread}
      />"""
if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/5: tab press now opens profile directly")
else:
    print("FAILED 2/5")

with open('screens/MainApp.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/2 applied so far")
