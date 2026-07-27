import shutil

PATH = "screens/MainApp.js"

with open(PATH, "r") as f:
    content = f.read()

shutil.copy(PATH, PATH + ".backup3")
print(f"Backup saved to {PATH}.backup3")

changes_made = 0

old_fn = "  const placeOrder = async () => {"
new_fn = """  const placeOrder = async () => {
    if (placingOrderRef.current) return;
    placingOrderRef.current = true;
"""

if old_fn in content:
    content = content.replace(old_fn, new_fn, 1)
    changes_made += 1
    print("Added double-tap guard at start of placeOrder")
else:
    print("Could not find placeOrder anchor - skipped")

# Add the ref declaration near other refs/state at top of component
old_ref_anchor = "  const [loyaltyPoints, setLoyaltyPoints] = useState(0);"
new_ref_anchor = """  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const placingOrderRef = useRef(false);"""

if old_ref_anchor in content:
    content = content.replace(old_ref_anchor, new_ref_anchor, 1)
    changes_made += 1
    print("Added placingOrderRef declaration")
else:
    print("Could not find loyaltyPoints anchor - skipped")

# Reset the guard after the order request completes (success path)
old_reset = """          fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pickup_time: pickupTime,
              total_amount: finalTotal,
              customer_name: customer?.name,
              customer_phone: customer?.phone,
              items: cart
            })
          }).then(r => r.json()).then(async d => {"""

new_reset = """          fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pickup_time: pickupTime,
              total_amount: finalTotal,
              customer_name: customer?.name,
              customer_phone: customer?.phone,
              items: cart
            })
          }).then(r => r.json()).then(async d => {
            placingOrderRef.current = false;"""

if old_reset in content:
    content = content.replace(old_reset, new_reset, 1)
    changes_made += 1
    print("Added guard reset after order completes")
else:
    print("Could not find order fetch anchor - skipped")

with open(PATH, "w") as f:
    f.write(content)

print(f"\n{changes_made}/3 changes applied.")
