with open('screens/MainApp.js', 'r') as f:
    content = f.read()

changes = 0

start_marker = """        {tab === 'store' && (
          <ScrollView contentContainerStyle={{ padding: 20 }}>

            {/* PROFILE BUTTON */}"""

end_marker = """            <View style={{ height: 30 }} />
          </ScrollView>
        )}
      </View>"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    replacement_point = end_idx + len("""            <View style={{ height: 30 }} />
          </ScrollView>
        )}""")
    content = content[:start_idx] + content[replacement_point:]
    changes += 1
    print("1/2: removed old Store tab content entirely")
else:
    print(f"FAILED 1/2 - start_idx={start_idx}, end_idx={end_idx}")

old2 = """      onNavigateToOrders={() => { setShowProfile(false); setTab('orders'); }}
      onNavigateToRewards={() => setShowRewards(true)}
    />"""
new2 = """      onNavigateToOrders={() => { setShowProfile(false); setTab('orders'); }}
      onNavigateToRewards={() => setShowRewards(true)}
      onNavigateToBikeHealth={() => { setShowProfile(false); setShowBikeHealth(true); }}
    />"""
if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/2: bike health navigation prop added")
else:
    print("FAILED 2/2")

with open('screens/MainApp.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/2 applied")
