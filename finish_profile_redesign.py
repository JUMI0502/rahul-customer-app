with open('screens/CustomerProfileScreen.js', 'r') as f:
    content = f.read()

changes = 0

# 1. Add onNavigateToBikeHealth to props
old1 = "onBack, onLogout, onNavigateToOrders, onNavigateToRewards }) {"
new1 = "onBack, onLogout, onNavigateToOrders, onNavigateToRewards, onNavigateToBikeHealth }) {"
if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("1/3: onNavigateToBikeHealth prop added")
else:
    print("FAILED 1/3")

# 2. Add Bike Health + Find Us on Map menu items, and expand store card
old2 = '''          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              `Hi! I'm ${name || customer?.name}, referring a friend to New Rahul Auto Spares. My number: ${phone || customer?.phone}`
            )}`
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="people-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Refer a Friend</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            `https://wa.me/${WHATSAPP}?text=Hi! I need help with something.`
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="headset-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            'https://rahul-auto-spares-backend.onrender.com/privacy-policy'
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="document-text-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        </View>

        {/* ── VISIT OUR STORE ── */}
        <TouchableOpacity style={s.storeCard} onPress={() => Linking.openURL('tel:08514244944')}>
          <View style={s.storeCardIcon}>
            <Ionicons name="storefront-outline" size={22} color="#C9A84C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.storeCardTitle}>New Rahul Auto Spares</Text>
            <Text style={s.storeCardSub}>Telugu Peta, Nandyal • Tap to call</Text>
          </View>
          <Ionicons name="call-outline" size={20} color="#C9A84C" />
        </TouchableOpacity>

        {/* ── PERSONAL DETAILS ── */}'''

new2 = '''          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => onNavigateToBikeHealth && onNavigateToBikeHealth()}>
            <View style={s.menuRowLeft}>
              <Ionicons name="build-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Bike Health Check</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              `Hi! I'm ${name || customer?.name}, referring a friend to New Rahul Auto Spares. My number: ${phone || customer?.phone}`
            )}`
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="people-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Refer a Friend</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            `https://wa.me/${WHATSAPP}?text=Hi! I need help with something.`
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="headset-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            'https://maps.google.com/?q=New+Rahul+Auto+Spares+Nandyal'
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="location-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Find Us on Map</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          <TouchableOpacity style={s.menuRow} onPress={() => Linking.openURL(
            'https://rahul-auto-spares-backend.onrender.com/privacy-policy'
          )}>
            <View style={s.menuRowLeft}>
              <Ionicons name="document-text-outline" size={20} color="#C9A84C" />
              <Text style={s.menuRowText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        </View>

        {/* ── VISIT OUR STORE ── */}
        <View style={s.storeCard}>
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={s.storeCardIcon}>
              <Ionicons name="storefront" size={24} color="#C9A84C" />
            </View>
            <Text style={[s.storeCardTitle, { marginTop: 8, fontSize: 16 }]}>New Rahul Auto Spares</Text>
            <Text style={s.storeCardSub}>Telugu Peta, Nandyal · 518501</Text>
          </View>
          {[
            { label: 'Phone', icon: 'call', value: '08514-244944', action: () => Linking.openURL('tel:08514244944') },
            { label: 'WhatsApp', icon: 'logo-whatsapp', value: '+91 6300281504', action: () => Linking.openURL(`https://wa.me/${WHATSAPP}`) },
            { label: 'Mon\\u2013Sat', icon: 'time', value: '10AM \\u2013 9PM' },
            { label: 'Sunday', icon: 'time', value: '10AM \\u2013 3PM' },
          ].map((r, i) => (
            <TouchableOpacity key={i} style={s.storeInfoRow} onPress={r.action} disabled={!r.action}>
              <View style={s.storeRowLeft}>
                <Ionicons name={r.icon} size={16} color="#C9A84C" style={{ width: 22 }} />
                <Text style={s.storeRowLabel}>{r.label}</Text>
              </View>
              <Text style={[s.storeRowValue, r.action && { color: '#4ADE80' }]}>{r.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PERSONAL DETAILS ── */}'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/3: menu expanded, store card now full-featured with contact rows")
else:
    print("FAILED 2/3")

with open('screens/CustomerProfileScreen.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/2 applied so far")
