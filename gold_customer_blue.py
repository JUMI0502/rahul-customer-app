with open('screens/MainApp.js', 'r') as f:
    content = f.read()

# Protect genuine exceptions: getPartLabel default categorical color (2 places)
# and the order-status "new" color mapping (part of new/packing/ready/collected sequence)
protect = [
    ("if (!sku) return { label: 'PART', color: '#4F6EF7', bg: 'rgba(79,110,247,0.15)' };",
     "if (!sku) return { label: 'PART', color: '###KEEP1###', bg: 'rgba(###KEEP2###,0.15)' };"),
    ("  return { label: 'PART', color: '#4F6EF7', bg: 'rgba(79,110,247,0.12)' };",
     "  return { label: 'PART', color: '###KEEP3###', bg: 'rgba(###KEEP4###,0.12)' };"),
    ("{ key: 'new', label: 'Placed', icon: 'ellipse-outline', color: '#4F6EF7' },",
     "{ key: 'new', label: 'Placed', icon: 'ellipse-outline', color: '###KEEP5###' },"),
]

protected = 0
for old, new in protect:
    if old in content:
        content = content.replace(old, new, 1)
        protected += 1
    else:
        print(f"PROTECT FAILED: {old[:60]}")

print(f"Protected {protected}/3 genuine exceptions")

before_hex = content.count("#4F6EF7")
before_rgba = content.count("79,110,247")

content = content.replace("#4F6EF7", "#C9A84C")
content = content.replace("79,110,247", "201,168,76")

print(f"Converted {before_hex} hex + {before_rgba} rgba to gold")

restore = [
    ("###KEEP1###", "#4F6EF7"),
    ("###KEEP2###", "79,110,247"),
    ("###KEEP3###", "#4F6EF7"),
    ("###KEEP4###", "79,110,247"),
    ("###KEEP5###", "#4F6EF7"),
]
for old, new in restore:
    content = content.replace(old, new)

with open('screens/MainApp.js', 'w') as f:
    f.write(content)

print("Exceptions restored - done")
