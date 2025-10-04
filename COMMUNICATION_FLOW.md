# 0xio Wallet ↔ SDK Communication Flow

**Complete Message Flow Documentation**

---

## 🔄 Communication Architecture Overview

The 0xio Wallet extension communicates with web applications through a **secure multi-layer message passing architecture**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Web Page (DApp)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌───────────────────────────────────────────────────────────┐   │
│   │            0xio SDK (TypeScript/JavaScript)                │   │
│   │  • ZeroXIOWallet class                                     │   │
│   │  • ExtensionCommunicator                                   │   │
│   │  • Rate limiting, retry logic                              │   │
│   └───────────────────────────────────────────────────────────┘   │
│                          ↕ window.postMessage()                    │
│   ┌───────────────────────────────────────────────────────────┐   │
│   │         sdk-bridge.js (Injected by Extension)              │   │
│   │  • Message validation                                      │   │
│   │  • Origin verification                                     │   │
│   │  • Protocol translation                                    │   │
│   └───────────────────────────────────────────────────────────┘   │
│                          ↕ window.postMessage()                    │
└─────────────────────────────────────────────────────────────────────┘
                             ↕ window.postMessage()
┌─────────────────────────────────────────────────────────────────────┐
│                    Browser Extension Context                         │
├─────────────────────────────────────────────────────────────────────┤
│   ┌───────────────────────────────────────────────────────────┐   │
│   │           content-script.js (Content Script)               │   │
│   │  • SDK detection                                           │   │
│   │  • Bridge injection                                        │   │
│   │  • Message forwarding                                      │   │
│   └───────────────────────────────────────────────────────────┘   │
│                     ↕ chrome.runtime.sendMessage()                 │
│   ┌───────────────────────────────────────────────────────────┐   │
│   │           background.js (Service Worker)                   │   │
│   │  • Wallet state management                                 │   │
│   │  • Transaction processing                                  │   │
│   │  • Network requests (bypass CORS)                          │   │
│   │  • DApp connection management                              │   │
│   └───────────────────────────────────────────────────────────┘   │
│                     ↕ chrome.storage API                           │
│   ┌───────────────────────────────────────────────────────────┐   │
│   │              chrome.storage.local                          │   │
│   │  • Wallet keys (encrypted)                                 │   │
│   │  • DApp connections                                        │   │
│   │  • User preferences                                        │   │
│   └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                             ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                    Octra Network RPC Server                         │
│                    https://octra.network                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📨 Complete Message Flow (Step by Step)

### **Example: Getting Wallet Balance**

```javascript
// DApp code
const wallet = new ZeroXIOWallet({ appName: 'My DApp' });
await wallet.initialize();
await wallet.connect();
const balance = await wallet.getBalance(); // ← We'll trace this
```

---

### **Step 1: SDK → sdk-bridge.js**

**Location:** `0xio_SDK/src/communication.ts:267-271`

```typescript
// SDK sends request via postMessage
private postMessageToExtension(request: ExtensionRequest): void {
    const targetOrigin = window.location.origin;
    window.postMessage({
        source: 'octra-sdk-request',  // ← Identifier
        request: {
            id: 'octra-sdk-a1b2c3d4...',
            method: 'get_balance',
            params: {},
            timestamp: 1696435200000
        }
    }, targetOrigin);  // ← Origin validated
}
```

**Message Format:**
```json
{
    "source": "octra-sdk-request",
    "request": {
        "id": "octra-sdk-a1b2c3d4-...",
        "method": "get_balance",
        "params": {},
        "timestamp": 1696435200000
    }
}
```

---

### **Step 2: sdk-bridge.js → content-script.js**

**Location:** `0xio_wallet/sdk-bridge.js:69-96`

```javascript
// Bridge validates and forwards message
function handleSDKRequest(event) {
    // ✅ Validate origin
    if (event.origin !== window.location.origin) {
        console.warn('[0xio Bridge] Rejected message from untrusted origin');
        return;
    }

    // ✅ Extract and reformat request
    const forwardedMessage = {
        source: 'octra-wallet-injected',  // ← Changed identifier
        requestId: request.id,
        method: request.method,
        params: request.params,
        timestamp: Date.now()
    };

    // Forward to content script
    window.postMessage(forwardedMessage, ALLOWED_ORIGIN);
}
```

**Message Format (Transformed):**
```json
{
    "source": "octra-wallet-injected",
    "requestId": "octra-sdk-a1b2c3d4-...",
    "method": "get_balance",
    "params": {},
    "timestamp": 1696435200123
}
```

---

### **Step 3: content-script.js → background.js**

**Location:** `0xio_wallet/content-script.js:180-198`

```javascript
// Content script listens for messages from bridge
window.addEventListener('message', (event) => {
    // ✅ Validate origin
    if (event.origin !== allowedOrigin) {
        return;
    }

    // Only handle wallet injected messages
    if (event.data.source === 'octra-wallet-injected') {

        // Forward to background service worker
        chrome.runtime.sendMessage({
            type: 'DAPP_MESSAGE',  // ← Message type for background
            data: event.data,
            origin: window.location.origin,
            hostname: window.location.hostname,
            url: window.location.href
        }, (response) => {
            // Will receive response and forward back...
        });
    }
});
```

**Message Format (Chrome Extension Message):**
```json
{
    "type": "DAPP_MESSAGE",
    "data": {
        "source": "octra-wallet-injected",
        "requestId": "octra-sdk-a1b2c3d4-...",
        "method": "get_balance",
        "params": {}
    },
    "origin": "https://example.com",
    "hostname": "example.com",
    "url": "https://example.com/app"
}
```

---

### **Step 4: background.js Processes Request**

**Location:** `0xio_wallet/background.js:169-247`

```javascript
// Background service worker handles DApp messages
async function handleDAppMessage(message, sender, sendResponse) {
    const { data, origin } = message;
    const { method, params } = data;

    try {
        let result;

        switch (method) {
            case 'get_balance':
                result = await handleDAppGetBalance(origin);
                break;
            // ... other methods
        }

        sendResponse({
            success: true,
            data: result
        });

    } catch (error) {
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Get balance implementation
async function handleDAppGetBalance(origin) {
    // 1. Check if DApp is connected
    const connection = dappConnections.get(origin);
    if (!connection || !connection.connected) {
        throw new Error('DApp not connected');
    }

    // 2. Get active wallet
    const activeWallet = await getActiveWallet();
    if (!activeWallet) {
        throw new Error('No active wallet');
    }

    // 3. Fetch balance from network
    const response = await fetch(
        `https://octra.network/balance/${activeWallet.address}`
    );
    const data = await response.json();

    // 4. Return formatted balance
    return {
        public: data.balance || 0,
        private: data.private_balance || 0,
        total: (data.balance || 0) + (data.private_balance || 0),
        currency: 'OCT'
    };
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "public": 100.5,
        "private": 50.25,
        "total": 150.75,
        "currency": "OCT"
    }
}
```

---

### **Step 5: background.js → content-script.js**

**Location:** Content script callback in `chrome.runtime.sendMessage()`

```javascript
chrome.runtime.sendMessage({ /* ... */ }, (response) => {
    if (chrome.runtime.lastError) {
        return;
    }

    // ✅ Send response back to bridge via postMessage
    window.postMessage({
        source: 'octra-wallet-content',  // ← Response identifier
        requestId: event.data.requestId,
        response: response  // ← Contains success/data/error
    }, allowedOrigin);
});
```

**Message Format:**
```json
{
    "source": "octra-wallet-content",
    "requestId": "octra-sdk-a1b2c3d4-...",
    "response": {
        "success": true,
        "data": {
            "public": 100.5,
            "private": 50.25,
            "total": 150.75,
            "currency": "OCT"
        }
    }
}
```

---

### **Step 6: content-script.js → sdk-bridge.js**

Message passes through `window.postMessage()` from content script to bridge.

---

### **Step 7: sdk-bridge.js → SDK**

**Location:** `0xio_wallet/sdk-bridge.js:102-128`

```javascript
// Bridge handles wallet responses
function handleWalletResponse(event) {
    if (!isValidMessage(event)) {
        return;
    }

    if (event.data.source === 'octra-wallet-content') {

        if (event.data.response) {
            const sdkResponse = {
                source: 'octra-sdk-bridge',  // ← SDK recognizes this
                response: {
                    id: event.data.requestId,
                    success: event.data.response.success,
                    data: event.data.response.data,
                    error: event.data.response.error,
                    timestamp: Date.now()
                }
            };

            // Send to SDK
            window.postMessage(sdkResponse, ALLOWED_ORIGIN);
        }
    }
}
```

**Message Format (Final):**
```json
{
    "source": "octra-sdk-bridge",
    "response": {
        "id": "octra-sdk-a1b2c3d4-...",
        "success": true,
        "data": {
            "public": 100.5,
            "private": 50.25,
            "total": 150.75,
            "currency": "OCT"
        },
        "error": null,
        "timestamp": 1696435201456
    }
}
```

---

### **Step 8: SDK Receives Response**

**Location:** `0xio_SDK/src/communication.ts:179-207`

```typescript
// SDK message listener receives response
window.addEventListener('message', (event) => {
    // ✅ Validate origin
    if (event.origin !== allowedOrigin) {
        this.logger.warn('Blocked message from untrusted origin');
        return;
    }

    // Check if it's an SDK bridge response
    if (event.data?.source === 'octra-sdk-bridge') {

        if (event.data.response) {
            const response = event.data.response;
            this.handleExtensionResponse(response);
        }
    }
});

// Handle response - resolve pending promise
private handleExtensionResponse(response: ExtensionResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) {
        return;
    }

    // Clear timeout and remove from pending
    clearTimeout(pending.timeout);
    this.pendingRequests.delete(response.id);

    // Resolve or reject promise
    if (response.success) {
        pending.resolve(response.data);  // ← Promise resolves here!
    } else {
        pending.reject(new OctraWalletError(
            response.error.code,
            response.error.message
        ));
    }
}
```

**Finally, the original promise resolves:**
```javascript
const balance = await wallet.getBalance();
// balance = { public: 100.5, private: 50.25, total: 150.75, currency: 'OCT' }
```

---

## 🔐 Security Layers

### **Layer 1: Origin Validation**
Every component validates `event.origin`:
- ✅ SDK validates messages from bridge
- ✅ Bridge validates messages from SDK and content script
- ✅ Content script validates messages from bridge

### **Layer 2: Source Identifiers**
Messages include source identifiers:
- `octra-sdk-request` - From SDK
- `octra-wallet-injected` - From bridge to content script
- `octra-wallet-content` - From content script to bridge
- `octra-sdk-bridge` - From bridge to SDK

### **Layer 3: Request ID Matching**
- Cryptographically secure random IDs
- Prevents request spoofing
- Enables request/response correlation

### **Layer 4: Chrome Extension Isolation**
- Background script runs in isolated context
- Content script has limited DOM access
- Storage is encrypted by Chrome

---

## 📊 Supported Methods

### **Connection Management**
- `register_dapp` - Register DApp with extension
- `connect` - Connect to wallet
- `disconnect` - Disconnect from wallet
- `getConnectionStatus` - Check connection state

### **Wallet Information**
- `ping` - Check extension availability
- `getWalletInfo` - Get wallet details
- `get_balance` / `getBalance` - Get wallet balance
- `get_network_info` - Get network information

### **Transactions** (Extended)
- `send_transaction` - Send regular transaction
- `send_private_transfer` - Send private transaction
- `claim_private_transfer` - Claim private transfer
- `get_transaction_history` - Get transaction history

### **Private Features**
- `get_private_balance_info` - Get encrypted balance info
- `encrypt_balance` - Encrypt public to private
- `decrypt_balance` - Decrypt private to public
- `get_pending_private_transfers` - Get pending transfers

---

## 🔄 Event Broadcasting

### **Extension → DApp Events**

The extension can broadcast events to connected DApps:

```javascript
// In background.js
function broadcastEventToDApp(origin, eventType, eventData) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url?.startsWith(origin)) {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'DAPP_EVENT',
                    eventData: { type: eventType, data: eventData }
                });
            }
        });
    });
}
```

**Event Types:**
- `balanceChanged` - Balance updated
- `networkChanged` - Network switched
- `accountChanged` - Active wallet changed
- `transactionConfirmed` - Transaction confirmed
- `extensionLocked` - Extension locked
- `extensionUnlocked` - Extension unlocked

---

## 🚀 Performance Optimizations

### **1. Rate Limiting**
- Max 50 concurrent requests
- Max 20 requests per second
- Prevents DoS attacks

### **2. Request Timeouts**
- Default: 30 seconds per request
- Configurable timeout per method
- Automatic cleanup of stale requests

### **3. Retry Logic**
- Exponential backoff: 1s → 2s → 4s
- Max 3 retries by default
- Configurable per request

### **4. Caching**
- DApp connections cached in memory
- Balance cached (with refresh option)
- Network info cached

---

## 🐛 Error Handling

### **Error Propagation Chain**

```
background.js throws error
    ↓
sendResponse({ success: false, error: message })
    ↓
content-script.js forwards error response
    ↓
sdk-bridge.js forwards error response
    ↓
SDK receives error response
    ↓
SDK throws OctraWalletError
    ↓
DApp catches error
```

### **Error Codes**

All errors follow standardized codes:
- `EXTENSION_NOT_FOUND`
- `CONNECTION_REFUSED`
- `USER_REJECTED`
- `INSUFFICIENT_BALANCE`
- `RATE_LIMIT_EXCEEDED`
- etc.

---

## 📝 Summary

The communication flow uses a **7-step message passing architecture**:

1. **SDK** → `window.postMessage()` → **sdk-bridge.js**
2. **sdk-bridge.js** → `window.postMessage()` → **content-script.js**
3. **content-script.js** → `chrome.runtime.sendMessage()` → **background.js**
4. **background.js** processes request (fetch from network, check storage, etc.)
5. **background.js** → callback response → **content-script.js**
6. **content-script.js** → `window.postMessage()` → **sdk-bridge.js**
7. **sdk-bridge.js** → `window.postMessage()` → **SDK**

**Security:**
- ✅ Every step validates origin
- ✅ Request IDs prevent spoofing
- ✅ Rate limiting prevents abuse
- ✅ Chrome extension isolation

**Performance:**
- ✅ Async/await throughout
- ✅ Promise-based API
- ✅ Automatic retries
- ✅ Request timeouts

---

*Last Updated: 2025-10-04*
