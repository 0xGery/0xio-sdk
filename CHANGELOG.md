# Changelog

All notable changes to the Octra Wallet SDK will be documented in this file.

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
- Browser console utilities at `window.__OCTRA_SDK_UTILS__`
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