with open('screens/MainApp.js', 'r') as f:
    content = f.read()

changes = 0

old1 = '''  const QUICK_ACTIONS = [  // Professional icon labels
    {
      icon: 'search', label: 'Browse Parts',
      labelTe: 'పార్ట్స్ చూడండి',
      color: '#C9A84C', bg: 'rgba(201,168,76,0.15)',
      action: () => setTab('browse')
    },
    {
      icon: 'receipt-outline', label: 'Track Orders',
      labelTe: 'ఆర్డర్ ట్రాక్',
      color: '#4ADE80', bg: 'rgba(74,222,128,0.15)',
      action: () => setTab('orders')
    },
    {
      icon: 'build', label: 'Bike Health',
      labelTe: 'బైక్ హెల్త్',
      color: '#FFC107', bg: 'rgba(255,193,7,0.15)',
      action: () => setShowBikeHealth(true)
    },
    {
      icon: 'bookmark-outline', label: 'Saved Parts',
      labelTe: 'సేవ్ చేసినవి',
      color: '#EF4444', bg: 'rgba(239,68,68,0.15)',
      action: () => setTab('favorites')
    },
    {
      icon: 'chatbubble-ellipses-outline', label: 'WhatsApp Us',
      labelTe: 'వాట్సాప్',
      color: '#25D366', bg: 'rgba(37,211,102,0.15)',
      action: () => Linking.openURL(`https://wa.me/${WHATSAPP}?text=Hi! I need help with spare parts`)
    },
  ];'''

new1 = '''  const QUICK_ACTIONS = [  // Professional icon labels
    {
      icon: 'search', label: 'Browse Parts', sub: 'Find parts for your bike',
      labelTe: 'పార్ట్స్ చూడండి',
      color: '#C9A84C', bg: 'rgba(201,168,76,0.15)',
      action: () => setTab('browse')
    },
    {
      icon: 'receipt-outline', label: 'Track Orders', sub: 'See your order history',
      labelTe: 'ఆర్డర్ ట్రాక్',
      color: '#4ADE80', bg: 'rgba(74,222,128,0.15)',
      action: () => setTab('orders')
    },
    {
      icon: 'build', label: 'Bike Health', sub: 'Free diagnosis for your bike',
      labelTe: 'బైక్ హెల్త్',
      color: '#FFC107', bg: 'rgba(255,193,7,0.15)',
      action: () => setShowBikeHealth(true)
    },
    {
      icon: 'bookmark-outline', label: 'Saved Parts', sub: 'Your bookmarked items',
      labelTe: 'సేవ్ చేసినవి',
      color: '#EF4444', bg: 'rgba(239,68,68,0.15)',
      action: () => setTab('favorites')
    },
    {
      icon: 'chatbubble-ellipses-outline', label: 'WhatsApp Us', sub: 'Chat with us directly',
      labelTe: 'వాట్సాప్',
      color: '#25D366', bg: 'rgba(37,211,102,0.15)',
      action: () => Linking.openURL(`https://wa.me/${WHATSAPP}?text=Hi! I need help with spare parts`)
    },
  ];'''

if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("1/2: subtitles added to QUICK_ACTIONS")
else:
    print("FAILED 1/2")

old2 = '''            {/* QUICK ACTIONS — 6 GRID */}
            <View style={s.qaSection}>
              <Text style={s.qaSectionTitle}>QUICK ACTIONS</Text>
              <View style={s.qaGrid}>
                {QUICK_ACTIONS.map((a, i) => (
                  <TouchableOpacity
                    key={i}
                    style={s.qaCard}
                    onPress={() => {
                      Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      a.action();
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={[s.qaIconBox,
                      { backgroundColor: a.bg }]}>
                      <Ionicons name={a.icon} size={24} color={a.color} />
                    </View>
                    <Text style={[s.qaLabel,
                      { color: a.color }]}>
                      {a.label}
                    </Text>
                    <Text style={s.qaLabelTe}>{a.labelTe}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>'''

new2 = '''            {/* QUICK ACTIONS — CLEAN LIST ROWS */}
            <View style={s.qaListCard}>
              {QUICK_ACTIONS.map((a, i) => (
                <View key={i}>
                  <TouchableOpacity
                    style={s.qaRow}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      a.action();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[s.qaRowIconBox, { backgroundColor: a.bg }]}>
                      <Ionicons name={a.icon} size={22} color={a.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.qaRowLabel}>{a.label}</Text>
                      <Text style={s.qaRowSub}>{a.sub}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
                  </TouchableOpacity>
                  {i < QUICK_ACTIONS.length - 1 && <View style={s.qaRowDivider} />}
                </View>
              ))}
            </View>'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/2: grid rendering replaced with list rows")
else:
    print("FAILED 2/2")

with open('screens/MainApp.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/2 applied")
