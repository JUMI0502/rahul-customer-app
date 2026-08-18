with open('screens/MainApp.js', 'r') as f:
    content = f.read()

old = """    <CustomerProfileScreen
      customer={customer}
      vehicle={vehicle}
      loyaltyPoints={loyaltyPoints}
      onBack={() => setShowProfile(false)}
      onLogout={onLogout}
    />"""

new = """    <CustomerProfileScreen
      customer={customer}
      vehicle={vehicle}
      loyaltyPoints={loyaltyPoints}
      onBack={() => setShowProfile(false)}
      onLogout={onLogout}
      onNavigateToOrders={() => { setShowProfile(false); setTab('orders'); }}
      onNavigateToRewards={() => setShowRewards(true)}
    />"""

if old in content:
    content = content.replace(old, new, 1)
    with open('screens/MainApp.js', 'w') as f:
        f.write(content)
    print("Applied - navigation props wired")
else:
    print("Anchor not found")
