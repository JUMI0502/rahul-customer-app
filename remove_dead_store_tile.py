with open('screens/MainApp.js', 'r') as f:
    content = f.read()

old = """    {
      icon: 'storefront-outline', label: 'Store Info',
      labelTe: 'స్టోర్ వివరాలు',
      color: '#00B4D8', bg: 'rgba(0,180,216,0.15)',
      action: () => setTab('store')
    },
    {
      icon: 'bookmark-outline', label: 'Saved Parts',"""

new = """    {
      icon: 'bookmark-outline', label: 'Saved Parts',"""

if old in content:
    content = content.replace(old, new, 1)
    with open('screens/MainApp.js', 'w') as f:
        f.write(content)
    print("Applied - dead Store Info tile removed")
else:
    print("Anchor not found")
