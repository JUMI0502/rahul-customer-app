with open('screens/MainApp.js', 'r') as f:
    content = f.read()

old = '''            {/* STORE HOURS */}
            <View style={s.hoursCard}>
              <Text style={s.hoursTitle}>Store Hours</Text>
              <View style={s.hoursRow}>
                <Text style={s.hoursDay}>Mon – Sat</Text>
                <Text style={s.hoursTime}>10:00 AM – 9:00 PM</Text>
              </View>
              <View style={s.hoursRow}>
                <Text style={s.hoursDay}>Sunday</Text>
                <Text style={s.hoursTime}>10:00 AM – 3:00 PM</Text>
              </View>
              <TouchableOpacity
                style={s.callBtn}
                onPress={() => Linking.openURL('tel:08514244944')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="call-outline" size={15} color="#fff" />
                  <Text style={s.callBtnText}>08514-244944</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ height: 100 }} />'''

new = '''            <View style={{ height: 100 }} />'''

if old in content:
    content = content.replace(old, new, 1)
    with open('screens/MainApp.js', 'w') as f:
        f.write(content)
    print("Applied - duplicate Store Hours removed from Home (still in Profile)")
else:
    print("Anchor not found")
