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
This app uses custom native modules and cannot run in Expo Go.
```bash
npx expo prebuild --clean
npx expo run:android
```
Requires a physical Android device connected via USB (or emulator) and
Android Studio / SDK installed locally.

## Test Accounts
- **Customer login:** any name + any 10-digit phone number (no verification
  required in current build)
- **Test phone used during development:** `1122334455` (has order history
  and loyalty points already on the backend)
- **Mechanic login:** requires approval via the store app's Mechanic
  Approvals screen — register with any details, then have someone with
  owner/senior access approve it in the store app

## What to Test
- Browse → Add to Cart → Checkout flow (confirm order actually reaches the
  store app / backend)
- Loyalty points: earn on order (1 pt per ₹50), redeem via My Rewards screen
  (checkout discount was intentionally removed — points can only be spent
  on catalog rewards now)
- Push notification: place an order, then have a store app mark it "Ready" —
  confirm notification arrives even with this app closed
- Favorites, order tracking, QR code display at pickup

## Known Limitations
- Slow product loading reported previously — root cause not fully
  identified, worth re-testing and reporting if still present
- No automated tests yet
- Requires Google Play Services (won't run on devices without it, e.g. some
  Huawei models)

## Reporting Bugs
Please include: exact steps to reproduce, screenshot if visual, and whether
it happens consistently or intermittently.
