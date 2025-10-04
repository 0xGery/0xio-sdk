# 🚀 Quick Start: Publish to npm

**Package:** @0xgery/wallet-sdk
**Current Version:** 0.2.1
**Target Version:** 1.0.0

---

## ⚡ Fast Track (If Everything is Ready)

```bash
cd /Users/gery/Documents/Octra_wallet/0xio_SDK

# 1. Login to npm
npm login

# 2. Build and test
npm run build
npm run typecheck

# 3. Update version
npm version 1.0.0

# 4. Publish
npm publish --access public

# Done! 🎉
```

---

## 📋 Step-by-Step Guide

### **Step 1: Prerequisites**

```bash
# Check Node.js version (need 16+)
node --version
# v16.0.0 or higher

# Check npm version
npm --version
# 7.0.0 or higher

# Verify you're in the right directory
pwd
# /Users/gery/Documents/Octra_wallet/0xio_SDK
```

### **Step 2: Create npm Account (if needed)**

**Option A: Via Command Line**
```bash
npm adduser
# Enter username: 0xgery (or choose your username)
# Enter password: ********
# Enter email: 0xgery@proton.me
```

**Option B: Via Website**
1. Go to https://www.npmjs.com/signup
2. Create account
3. Verify email
4. Then login: `npm login`

### **Step 3: Verify Login**

```bash
npm whoami
# Should print your username: 0xgery

# Check authentication
npm config get registry
# Should be: https://registry.npmjs.org/
```

### **Step 4: Clean Build**

```bash
# Remove old builds
rm -rf dist/ node_modules/

# Fresh install
npm install

# Build the package
npm run build

# Verify dist folder
ls -la dist/
# Should contain:
# - index.js
# - index.esm.js
# - index.umd.js
# - index.d.ts
```

### **Step 5: Update package.json**

Edit `package.json` and ensure these fields are correct:

```json
{
  "name": "@0xgery/wallet-sdk",
  "version": "1.0.0",
  "description": "Official TypeScript SDK for 0xio Wallet - Secure blockchain wallet integration",
  "homepage": "https://github.com/0xGery/0xio-wallet",
  "bugs": "https://github.com/0xGery/0xio-wallet/issues",
  "repository": {
    "type": "git",
    "url": "https://github.com/0xGery/0xio-wallet.git",
    "directory": "0xio_SDK"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### **Step 6: Test Package Locally**

```bash
# Create a tarball
npm pack

# This creates: 0xgery-wallet-sdk-1.0.0.tgz

# Test in another directory
cd /tmp
mkdir test-sdk
cd test-sdk
npm init -y
npm install /Users/gery/Documents/Octra_wallet/0xio_SDK/0xgery-wallet-sdk-1.0.0.tgz

# Test it works
node
> const { ZeroXIOWallet } = require('@0xgery/wallet-sdk');
> console.log(typeof ZeroXIOWallet); // Should print 'function'
> .exit

# Clean up
cd /Users/gery/Documents/Octra_wallet/0xio_SDK
rm *.tgz
```

### **Step 7: Dry Run**

```bash
# See what will be published
npm publish --dry-run

# Review the output carefully:
# - Check file list
# - Verify size (should be < 100KB)
# - Confirm package name and version
```

**Expected output:**
```
npm notice
npm notice 📦  @0xgery/wallet-sdk@1.0.0
npm notice === Tarball Contents ===
npm notice 1.2kB  package.json
npm notice 1.1kB  LICENSE
npm notice 15.3kB README.md
npm notice 2.5kB  CHANGELOG.md
npm notice 45.2kB dist/index.js
npm notice 43.8kB dist/index.esm.js
npm notice 48.1kB dist/index.umd.js
npm notice 12.4kB dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @0xgery/wallet-sdk
npm notice version:       1.0.0
npm notice package size:  85.3 KB
npm notice unpacked size: 169.6 KB
npm notice total files:   8
```

### **Step 8: Git Commit**

```bash
# Stage all changes
git add .

# Commit
git commit -m "Release v1.0.0 - Production ready

- Complete TypeScript SDK for 0xio Wallet
- Security fixes: origin validation, rate limiting
- Comprehensive documentation
- Professional code quality
- Ready for npm publication"

# Create version tag
git tag v1.0.0

# Push to GitHub
git push origin main
git push origin v1.0.0
```

### **Step 9: Publish to npm**

```bash
# Final publish
npm publish --access public

# Wait for completion...
# You should see:
# + @0xgery/wallet-sdk@1.0.0
```

### **Step 10: Verify Publication**

```bash
# Open package page
open https://www.npmjs.com/package/@0xgery/wallet-sdk

# Or check from command line
npm view @0xgery/wallet-sdk

# Install from npm to verify
cd /tmp
mkdir verify-install
cd verify-install
npm init -y
npm install @0xgery/wallet-sdk

# Test it
node -e "console.log(require('@0xgery/wallet-sdk'))"
# Should print the module exports
```

---

## 🎉 Post-Publication

### **1. Update README with npm Badge**

Add to top of `README.md`:

```markdown
[![npm version](https://badge.fury.io/js/%400xgery%2Fwallet-sdk.svg)](https://badge.fury.io/js/%400xgery%2Fwallet-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@0xgery/wallet-sdk.svg)](https://npmjs.com/package/@0xgery/wallet-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

\`\`\`bash
npm install @0xgery/wallet-sdk
\`\`\`
```

### **2. Create GitHub Release**

1. Go to: https://github.com/0xGery/0xio-wallet/releases/new
2. Choose tag: `v1.0.0`
3. Title: `v1.0.0 - Production Release`
4. Description: Copy from `CHANGELOG.md`
5. Attach: `0xgery-wallet-sdk-1.0.0.tgz`
6. Click "Publish release"

### **3. Announce**

**On GitHub:**
- Update main README.md
- Pin release announcement

**On Social Media:**
```
🎉 Excited to announce @0xgery/wallet-sdk v1.0.0!

Official TypeScript SDK for integrating dApps with 0xio Wallet 🚀

Features:
✅ Secure wallet connection
✅ Private transactions
✅ Event-driven architecture
✅ Full TypeScript support

Install: npm install @0xgery/wallet-sdk

Docs: github.com/0xGery/0xio-wallet
```

---

## 🐛 Troubleshooting

### **Error: 403 Forbidden**

```bash
# Check if package name is available
npm view @0xgery/wallet-sdk

# If taken, you need to:
# 1. Choose different name, OR
# 2. Use different scope (@yourname/wallet-sdk)
```

### **Error: You must sign in**

```bash
# Re-login
npm logout
npm login

# Verify
npm whoami
```

### **Error: Package size too large**

```bash
# Check what's being included
npm pack
tar -tzf *.tgz | less

# Update .npmignore to exclude more files
```

### **Error: Missing files**

```bash
# Check files field in package.json
# Make sure dist/ is included

# Rebuild
npm run build

# Verify dist exists
ls -la dist/
```

---

## 📦 Alternative: Beta Release

If you want to test on npm first:

```bash
# Publish as beta
npm version 1.0.0-beta.1
npm publish --tag beta --access public

# Install beta version
npm install @0xgery/wallet-sdk@beta

# When ready, promote to latest
npm dist-tag add @0xgery/wallet-sdk@1.0.0 latest
```

---

## 🔄 Future Updates

### **Patch Release (1.0.1)**

```bash
# Bug fixes only
npm version patch
# Creates 1.0.1

npm publish --access public
```

### **Minor Release (1.1.0)**

```bash
# New features, backward compatible
npm version minor
# Creates 1.1.0

npm publish --access public
```

### **Major Release (2.0.0)**

```bash
# Breaking changes
npm version major
# Creates 2.0.0

npm publish --access public
```

---

## ✅ Final Checklist

Before running `npm publish`:

- [ ] Tests pass (or add later)
- [ ] Build completes: `npm run build`
- [ ] TypeScript checks: `npm run typecheck`
- [ ] LICENSE file exists
- [ ] README.md is complete
- [ ] CHANGELOG.md updated
- [ ] package.json version is correct
- [ ] Git committed and tagged
- [ ] Logged into npm
- [ ] Dry run reviewed: `npm publish --dry-run`
- [ ] Ready to publish! 🚀

---

## 📞 Support

**Issues during publication?**

- npm documentation: https://docs.npmjs.com/
- Package naming: https://docs.npmjs.com/cli/v8/using-npm/scope
- Publishing guide: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages

**Contact:**
- Email: 0xgery@proton.me
- Telegram: @nullXgery

---

**Good luck with your first npm publish!** 🎉

*Last updated: 2025-10-04*
