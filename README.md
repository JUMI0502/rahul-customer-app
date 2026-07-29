# New Rahul Auto Spares — Customer App

React Native (Expo SDK 54) app for customers to browse parts, place orders,
and track loyalty rewards.

## Local Setup
```bash
git clone <repo-url>
cd rahul-customer-app
npm install
```

You'll need `google-services.json` (Firebase config for push notifications)
placed in the project root — get this from the team lead if not already present.

## Running (development build — required, Expo Go will NOT work)
This app uses custom native modules (including `expo-updates` for OTA
updates) and cannot run in Expo Go.
```bash
npx expo prebuild --clean
npx expo run:android
```
Requires a physical Android device connected via USB (or emulator) and
Android Studio / SDK installed locally.

**Known build issue**: if the app crashes with a `NoSuchMethodError` related
to `expo-font` on startup, run:
```bash
rm -rf node_modules/expo-font
npx expo prebuild --clean
npx expo run:android
```
This is a recurring phantom top-level `expo-font` install conflict — this
fix resolves it every time it's appeared.

## Test Accounts
- **Customer login**: any name + any 10-digit phone number, then **set a
  4-digit PIN** (new — first-time customers create a PIN, returning
  customers must enter it correctly). This closes a real privacy gap where
  previously anyone could see another customer's data by entering their phone
  number.
- **Test phone used during development**: `1122334455` (has order history
  and loyalty points already on the backend — you'll be prompted to create a
  PIN the first time you use it post-update)
- **Mechanic login**: requires approval via the store app's Mechanic
  Approvals screen — register with any details, then have someone with
  owner/senior access approve it in the store app

## What to Test
### Core flow
- Browse → Add to Cart → Checkout (confirm order reaches the store app / backend)
- **New PIN login flow**: create a PIN as a new customer, log out, log back
  in with the correct and then an incorrect PIN

### Loyalty & Rewards (redesigned)
- Points are earned on orders but **can no longer be redeemed as a checkout
  discount** — this was intentionally removed
- Redeem points via My Rewards screen instead (includes a new "Free Goodies"
  reward at 1000 points)
- **Referral Program (new)**: share your number via the "Refer a Friend"
  card; when a first-time customer enters your number at checkout, you both
  get bonus points automatically

### Other
- Push notification: place an order, have staff mark it "Ready," confirm
  notification arrives with the app closed
- Favorites, order tracking, QR code display at pickup
- Product detail: OEM badge should say "Original OEM" or "Generic /
  Compatible Part" based on real backend data, not shown universally
- **Delete My Account** (Profile screen) — should permanently remove your
  PIN, loyalty points, and profile; past orders remain but are anonymized

## Known Limitations
- Slow product loading reported previously — root cause not fully
  identified, worth re-testing and reporting if still present
- Delivery option exists in code but is disabled (business decision — mechanics
  and customers currently pick up in person)
- No automated tests yet
- Requires Google Play Services (won't run on devices without it)

## Privacy Policy
Live at: https://rahul-auto-spares-backend.onrender.com/privacy-policy

## Reporting Bugs
Please include: exact steps to reproduce, screenshot if visual, and whether
it happens consistently or intermittently.
