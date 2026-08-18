with open('screens/CustomerProfileScreen.js', 'r') as f:
    content = f.read()

old_start = '''        {/* ── PERSONAL DETAILS ── */}
        <View style={s.card}>'''
new_start = '''        {/* ── PERSONAL DETAILS (only shown while editing, to keep the default view short) ── */}
        {editing && (
        <View style={s.card}>'''

changes = 0
if old_start in content:
    content = content.replace(old_start, new_start, 1)
    changes += 1
    print("1/2: personal details section now conditionally wrapped (start)")
else:
    print("FAILED 1/2")

old_end = '''          <Text style={[s.logoutText, { color: '#EF4444' }]}>Delete My Account</Text>
        </TouchableOpacity>

        {/* EDIT HINT */}'''
new_end = '''          <Text style={[s.logoutText, { color: '#EF4444' }]}>Delete My Account</Text>
        </TouchableOpacity>
        </View>
        )}

        {/* EDIT HINT */}'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)
    changes += 1
    print("2/2: closing wrapper added")
else:
    print("FAILED 2/2")

with open('screens/CustomerProfileScreen.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/2 applied")
