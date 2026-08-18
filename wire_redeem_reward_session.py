with open('screens/MainApp.js', 'r') as f:
    content = f.read()

old = '''              const r = await fetch(`${API_URL}/loyalty/${customer?.phone}/redeem-reward`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reward_id: reward.id, points: reward.points_required })
              });'''
new = '''              const r = await fetch(`${API_URL}/loyalty/${customer?.phone}/redeem-reward`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-session-token': customer?.sessionToken || '' },
                body: JSON.stringify({ reward_id: reward.id, points: reward.points_required })
              });'''

if old in content:
    content = content.replace(old, new, 1)
    with open('screens/MainApp.js', 'w') as f:
        f.write(content)
    print("Applied - reward redemption now sends customer session token")
else:
    print("Anchor not found")
