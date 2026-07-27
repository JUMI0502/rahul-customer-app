import shutil

PATH = "App.js"

with open(PATH, "r") as f:
    content = f.read()

shutil.copy(PATH, PATH + ".backup2")
print(f"Backup saved to {PATH}.backup2")

old = "const API_URL = 'https://rahul-auto-spares-backend.onrender.com';"
new = """const API_URL = 'https://rahul-auto-spares-backend.onrender.com';
const API_SECRET_KEY = 'zFWqAraDGYhsNzIe76vXOm0hifitH1bxLmQ6S-8qeN8';

const originalFetch = global.fetch;
global.fetch = (url, options = {}) => {
  if (typeof url === 'string' && url.startsWith(API_URL)) {
    options.headers = { ...(options.headers || {}), 'x-api-key': API_SECRET_KEY };
  }
  return originalFetch(url, options);
};"""

if old in content:
    content = content.replace(old, new, 1)
    with open(PATH, "w") as f:
        f.write(content)
    print("Added global fetch wrapper with API key successfully.")
else:
    print("Could not find API_URL anchor - no changes made.")
