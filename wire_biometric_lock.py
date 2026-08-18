with open('App.js', 'r') as f:
    content = f.read()

changes = 0

# 1. Add import
old1 = '''import LoginScreen from './screens/LoginScreen';
import VehicleSelectScreen from './screens/VehicleSelectScreen';
import MainApp from './screens/MainApp';'''
new1 = '''import LoginScreen from './screens/LoginScreen';
import VehicleSelectScreen from './screens/VehicleSelectScreen';
import MainApp from './screens/MainApp';
import BiometricLockScreen from './screens/BiometricLockScreen';'''
if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("1/4: import added")
else:
    print("FAILED 1/4")

# 2. Gate both setScreen('main') calls behind the biometric check
old2 = '''      if (savedMechanic) {
        const m = JSON.parse(savedMechanic);
        if (m.status === 'approved') {
          setCustomer(m);
          setIsMechanic(true);
          if (savedVehicle) setVehicle(JSON.parse(savedVehicle));
          if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
          setScreen('main');
          registerForPushNotifications(m.phone);
        } else {
          setScreen('login');
        }
      } else if (saved) {
        const parsedCustomer = JSON.parse(saved);
        setCustomer(parsedCustomer);
        if (savedVehicle) setVehicle(JSON.parse(savedVehicle));
        if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
        setScreen('main');
        registerForPushNotifications(parsedCustomer.phone);
      } else {
        setScreen('login');
      }'''
new2 = '''      const biometricEnabled = await AsyncStorage.getItem('biometric_lock_enabled');

      if (savedMechanic) {
        const m = JSON.parse(savedMechanic);
        if (m.status === 'approved') {
          setCustomer(m);
          setIsMechanic(true);
          if (savedVehicle) setVehicle(JSON.parse(savedVehicle));
          if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
          setScreen(biometricEnabled === 'true' ? 'biometric-lock' : 'main');
          registerForPushNotifications(m.phone);
        } else {
          setScreen('login');
        }
      } else if (saved) {
        const parsedCustomer = JSON.parse(saved);
        setCustomer(parsedCustomer);
        if (savedVehicle) setVehicle(JSON.parse(savedVehicle));
        if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
        setScreen(biometricEnabled === 'true' ? 'biometric-lock' : 'main');
        registerForPushNotifications(parsedCustomer.phone);
      } else {
        setScreen('login');
      }'''
if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("2/4: biometric gate added to initApp")
else:
    print("FAILED 2/4")

# 3. Add the render branch for biometric-lock
old3 = '''  if (screen === 'login') {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <LoginScreen
          onCustomerLogin={handleCustomerLogin}
          onMechanicLogin={handleMechanicLogin}
          onMechanicPending={handleMechanicPending}
        />
      </>
    );
  }'''
new3 = '''  if (screen === 'biometric-lock') {
    return (
      <BiometricLockScreen
        onUnlock={() => setScreen('main')}
        onUsePinInstead={() => setScreen('login')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <LoginScreen
          onCustomerLogin={handleCustomerLogin}
          onMechanicLogin={handleMechanicLogin}
          onMechanicPending={handleMechanicPending}
        />
      </>
    );
  }'''
if old3 in content:
    content = content.replace(old3, new3, 1)
    changes += 1
    print("3/4: biometric-lock render branch added")
else:
    print("FAILED 3/4")

with open('App.js', 'w') as f:
    f.write(content)

print(f"\n{changes}/3 applied")
