# Changelog

All notable changes to the 0xio Wallet SDK will be documented in this file.

## [1.0.3] - 2025-10-04

### Changed
- Updated CHANGELOG.md with complete release notes for all versions

---

## [1.0.2] - 2025-10-04

### Changed
- Removed development-only documentation files for cleaner npm package
- Package now only includes essential documentation (README, CHANGELOG, LICENSE)

---

## [1.0.1] - 2025-10-04

### Fixed
- Added missing RATE_LIMIT_EXCEEDED error message
- Fixed branding: Updated all references from "Octra Wallet" to "0xio Wallet"
- Clarified SDK is for Octra Network/blockchain, not "0xio network"

---

## [1.0.0] - 2025-10-04

### Major Release - Production Ready

This is the first stable release of the 0xio Wallet SDK, a comprehensive bridge for dApps to connect to the 0xio Wallet extension on the Octra Network.

### Security Improvements
- **Fixed 8 critical wildcard origins** in postMessage communication
- **Origin validation**: All messages now validate against `window.location.origin`
- **Rate limiting**: Implemented 50 concurrent requests, 20 requests/second limits
- **Cryptographic request IDs**: Using `crypto.randomUUID()` instead of predictable sequential IDs
- **Professional code refactoring**: All files now include comprehensive JSDoc documentation

### Package Changes
- **Package renamed**: `@0xgery/wallet-sdk` → `@0xgery/0xio-sdk`
- **Version bump**: 0.2.1 → 1.0.0 (production-ready)
- **Repository**: Published to https://github.com/0xGery/0xio-sdk
- **Homepage**: https://0xio.xyz

### Branding Updates
- SDK rebranded from "Octra Wallet SDK" to "0xio Wallet SDK"
- Wallet name: 0xio Wallet (for Octra Network)
- Currency: OCT (Octra Network's native gas token)

### Files Added
- LICENSE (MIT)
- .npmignore (excludes examples, source, docs from npm package)
- .gitignore (standard Node.js gitignore)
- Complete integration examples (React, Vue, Vanilla JS)

### Technical Improvements
- **JSDoc coverage**: 0% → 95%
- **Code quality**: Refactored all functions to <30 lines
- **Error handling**: Enhanced with detailed context and diagnostics
- **TypeScript**: Full type safety with comprehensive type definitions

### Breaking Changes
None - maintains backward compatibility with exported `OctraWallet` class (also exported as `ZeroXIOWallet`)

---

## [0.2.1] - 2025-09-09

### Changes
- Update debugging messages to use plain text formatting

---

## [0.2.0] - 2025-09-09

### Major Features Added

- **Built-in Extension Detection**: No longer requires wrapper polling - SDK automatically detects and monitors extension availability
- **Automatic Retry Logic**: Exponential backoff retry system for all extension requests (3 retries by default)
- **Enhanced Error Diagnostics**: Detailed error reporting showing specific failure causes, browser state, and extension diagnostics
- **Event-Based Communication**: Real-time extension events replace polling - instant updates for account changes, balance updates, network switches
- **Development Mode**: Comprehensive debugging tools with detailed logging for development environments

### Technical Improvements

#### Extension Detection
- Continuous background monitoring of extension availability
- Multiple detection methods: runtime checks, DOM signals, extension-specific indicators
- Automatic reconnection attempts when extension becomes available
- Detailed browser compatibility diagnostics

#### Retry & Error Handling
- Exponential backoff retry logic (1s, 2s, 4s delays)
- Enhanced error context with request IDs, retry counts, timestamps
- Browser and extension state diagnostics in error details
- Specific timeout handling with detailed failure information

#### Event System
- Real-time event forwarding from extension to SDK
- Automatic balance updates on transaction confirmations
- Account and network change detection and handling
- Extension lock/unlock state management
- Event-driven connection state management

#### Development Tools
- Advanced logging system with grouped output and table formatting
- Debug mode auto-detection for localhost/development environments
- Browser console utilities at `window.__ZEROXIO_SDK_UTILS__`
- Extension event simulation for testing
- Comprehensive SDK state inspection tools

### API Enhancements

#### New Utility Functions (now exported)
```typescript
// Validation
isValidAddress, isValidAmount, isValidMessage, isValidFeeLevel, isValidNetworkId

// Formatting
formatOCT, formatAddress, formatTimestamp, formatTxHash

// Conversion
toMicroOCT, fromMicroOCT

// Error handling
createErrorMessage, isErrorType

// Async utilities
delay, retry, withTimeout

// Browser support
isBrowser, checkBrowserSupport

// Development
generateMockData, createLogger
```

#### Enhanced Debug Information
- `getDebugInfo()` now includes extension diagnostics and availability state
- Real-time extension state monitoring
- Detailed browser environment detection

### Bug Fixes
- Fixed substr() deprecation warning (replaced with substring())
- Improved error handling for edge cases in extension communication
- Better cleanup of pending requests and event listeners
- Enhanced memory management for background processes

### Developer Experience
- Rich console output with grouped logging in development mode
- Automatic debug mode detection for development environments
- Extension event simulation tools for testing
- Comprehensive error messages with actionable information
- SDK state inspection utilities accessible from browser console

### Breaking Changes
None - this version maintains full backward compatibility with v0.1.x

### Performance Improvements
- Reduced polling overhead by switching to event-based communication
- More efficient extension detection with targeted checks
- Optimized retry logic to reduce unnecessary network calls
- Background monitoring with minimal CPU impact

---

## [0.1.2-dev] - Previous Version
- Initial SDK implementation
- Basic extension communication
- Core wallet operations
- Transaction handling
- Private transfer support
