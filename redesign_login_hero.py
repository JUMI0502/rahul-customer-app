with open('screens/LoginScreen.js', 'r') as f:
    content = f.read()

changes = 0

# 1. Add LinearGradient import
old1 = "import { Ionicons } from '@expo/vector-icons';"
new1 = "import { Ionicons } from '@expo/vector-icons';\nimport { LinearGradient } from 'expo-linear-gradient';"
if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("1/5: LinearGradient import added")
else:
    print("FAILED 1/5")

# 2. Redesign the shield/hero badge with a gradient + icon
old2 = '''            <View style={s.shieldWrap}>
              <View style={s.shield}>
                <Text style={s.shieldRAS}>RAS</Text>
              </View>
            </View>'''
new2 = '''            <View style={s.shieldWrap}>
              <LinearGradient
                colors={['#E8C874', '#C9A84C', '#8A6D2F']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.shield}>
                <Ionicons name="storefront" size={30} color="#07111F" />
                <Text style={s.shieldRAS}>RAS</Text>
              </LinearGradient>
            </View>'''
if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/5: hero badge now uses gradient + icon")
else:
    print("FAILED 2/5")

# 3. Remove the pill tags from the customer card
old3 = '''              <Text style={s.roleTe}>స్పేర్ పార్ట్స్ కొనండి</Text>
              <View style={s.roleTagRow}>
                {['Free Account', 'All Bikes', 'Fast Pickup'].map((tag, i) => (
                  <View key={i} style={[s.roleTag, { backgroundColor: 'rgba(201,168,76,0.1)' }]}>
                    <Text style={[s.roleTagText, { color: '#C9A84C' }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>'''
new3 = '''              <Text style={s.roleTe}>స్పేర్ పార్ట్స్ కొనండి</Text>
            </View>'''
if old3 in content:
    content = content.replace(old3, new3, 1)
    changes += 1
    print("3/5: pill tag clutter removed from customer card")
else:
    print("FAILED 3/5")

# 4. Remove the Store Info block entirely (redundant with Profile now)
old4 = '''          {/* STORE INFO */}
          <View style={s.storeInfoBox}>
            <View style={s.storeInfoRow}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>Mon–Sat: 10AM–9PM · Sun: 10AM–3PM</Text>
            </View>
            <View style={s.storeInfoRow}>
              <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>08514-244944</Text>
            </View>
            <View style={s.storeInfoRow}>
              <Ionicons name="logo-whatsapp" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>WhatsApp: +91 6300281504</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />'''
new4 = '''          <View style={{ height: 30 }} />'''
if old4 in content:
    content = content.replace(old4, new4, 1)
    changes += 1
    print("4/5: redundant Store Info block removed")
else:
    print("FAILED 4/5")

with open('screens/LoginScreen.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/4 applied so far")
