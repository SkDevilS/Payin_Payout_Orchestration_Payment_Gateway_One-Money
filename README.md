<div align="center">

<img src="https://img.shields.io/badge/One__Money-Payment%20Orchestration-6366f1?style=for-the-badge&logoColor=white" />

# 💸 One_Money

### Enterprise Payment Orchestration Platform

**Multi-gateway routing · API partner integration · Real-time admin control · Intelligent failover**

![Status](https://img.shields.io/badge/Status-Active-22c55e?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-ef4444?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20Flask-3b82f6?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-06b6d4?style=flat-square)
![Database](https://img.shields.io/badge/Database-MySQL%208.0+-f97316?style=flat-square)

</div>

---

## 🌐 What is One_Money?

**One_Money** is a production-grade **payment orchestration platform** designed to sit as the intelligent middleware between your integration partners and multiple payment gateways. Instead of your partners integrating with each gateway individually, they connect once to One_Money — and you control everything from there.

Whether it's routing a pay-in to the fastest available gateway, executing a payout through the most cost-effective partner, or instantly failing over when a gateway goes down — One_Money handles it silently and reliably, 24/7.

> 🏦 Built for fintechs, payment aggregators, and businesses that need full control over their payment infrastructure.

---

## ✨ Key Highlights

| Feature | Description |
|---|---|
| 🔀 **Smart Routing** | Route transactions to the optimal gateway based on custom business rules |
| 🔌 **Unified API** | One API endpoint for all your integration partners — no gateway sprawl |
| 🔄 **Auto Failover** | Automatic rerouting when a gateway is slow or unavailable |
| 💼 **Multi-Partner Support** | Manage multiple API partners with isolated access and controls |
| 📊 **Real-time Dashboard** | Live transaction monitoring, wallet balances, and fund operations |
| 🔐 **Enterprise Security** | JWT auth, session management, CAPTCHA, lockout policies & audit logs |
| 📁 **Full Audit Trail** | Every action logged with IP, user agent, timestamp, and outcome |
| ⚙️ **Configurable Rules** | Priority rules, load balancing, and failover — no code changes needed |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│            Integration Partners / Clients        │
│         (Connect once via One_Money API)         │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              One_Money API Layer                 │
│    Authentication · Rate Limiting · Logging      │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│            Orchestration & Routing Engine        │
│   Business Rules · Failover · Load Balancing     │
└──────────┬────────────┬────────────┬────────────┘
           │            │            │
           ▼            ▼            ▼
      ┌─────────┐  ┌─────────┐  ┌─────────┐
      │Gateway 1│  │Gateway 2│  │Gateway N│
      │ Adapter │  │ Adapter │  │ Adapter │
      └─────────┘  └─────────┘  └─────────┘
           │            │            │
           └────────────┴────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│         MySQL Database · Audit Logs              │
│     Wallets · Transactions · Partner Data        │
└─────────────────────────────────────────────────┘
```

---

## 🧩 Platform Modules

### 💳 Payment Orchestration
The core engine. Accepts pay-in and pay-out requests from partners, applies routing rules, and dispatches to the appropriate gateway. Handles response normalization so every partner gets a consistent response format regardless of which gateway processed the transaction.

### 🔌 Partner API
A secure, versioned REST API that your integration partners use to initiate transactions, check statuses, and receive webhooks. Access is scoped per partner — each partner only sees what they're authorized for.

### 🏦 Wallet & Fund Management
Internal ledger system for tracking balances across partners and gateways. Supports fund allocation, settlement tracking, and balance reconciliation — all visible in real time from the admin panel.

### 📈 Transaction Reporting
Detailed transaction history with filtering by partner, gateway, status, date range, and amount. Designed for both operational monitoring and financial reconciliation.

### 🛡️ Admin Control Panel
A browser-based React dashboard secured with JWT authentication. Supports multi-admin access with full activity logging. Every action taken in the panel is recorded.

---

## 🔐 Security Architecture

One_Money is built with a security-first approach at every layer:

- 🔑 **JWT Authentication** — Token-based auth with configurable expiry
- ⏱️ **Session Inactivity Timeout** — Auto-expiry after inactivity with countdown warning
- 🤖 **CAPTCHA on Login** — Visual CAPTCHA to block automated attacks
- 🔒 **Bcrypt Password Hashing** — Salted hashing, no plaintext ever stored
- 🚫 **Account Lockout Policy** — Automatic lock after repeated failed attempts
- 📋 **Full Audit Logging** — IP address, user agent, action type, and result for every event
- 🌐 **CORS Enforcement** — Strict origin policy, configurable per environment
- 💉 **SQL Injection Prevention** — Parameterized queries throughout
- 🛣️ **Protected Routes** — Frontend route guards backed by server-side token verification
- 🔄 **One-click Session Refresh** — Extend sessions without full re-login

---

## 🗄️ Database Design

The platform uses a normalized MySQL schema covering:

- 👥 **Partners & Users** — partner profiles, credentials, access scopes
- 💳 **Transactions** — full lifecycle from initiation to settlement
- 💰 **Wallets** — per-partner balance ledgers with movement history
- ⚙️ **Gateway Config** — active gateways, priority rules, failover config
- 📋 **Audit Logs** — immutable activity trail for all admin and API actions
- 🔐 **Admin Users** — admin accounts with lockout and session tracking

---

## 🛠️ Tech Stack

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| Python 3.8+ | Core runtime |
| Flask 3.0 | Web framework |
| Flask-JWT-Extended | Authentication |
| PyMySQL | Database connector |
| bcrypt | Password hashing |
| Pillow | CAPTCHA generation |
| Flask-CORS | Cross-origin policy |

### 🎨 Frontend (Admin Panel)
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tooling |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| React Router v6 | Client-side routing |
| Sonner | Toast notifications |
| Lucide React | Icon system |

### 🗃️ Infrastructure
| Component | Technology |
|---|---|
| Database | MySQL 8.0+ |
| API Protocol | REST / JSON |
| Auth | JWT (Bearer Token) |

---

## 📡 API Overview

### 🔓 Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/transaction/payin` | Initiate a pay-in |
| `POST` | `/api/v1/transaction/payout` | Initiate a payout |
| `GET` | `/api/v1/transaction/status/:id` | Check transaction status |
| `GET` | `/api/v1/health` | Platform health check |

### 🔒 Partner-Authenticated Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/wallet/balance` | Partner wallet balance |
| `GET` | `/api/v1/transactions` | Transaction history |
| `POST` | `/api/v1/webhook/register` | Register webhook URL |

### 🛡️ Admin Panel API
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/admin/activity-logs` | Audit log retrieval |
| `POST` | `/api/admin/logout` | Admin logout |
| `GET` | `/api/admin/verify` | Token verification |

> 🔒 All partner and admin endpoints require authentication. API keys and JWT tokens are issued separately.

---

## 🚀 Deployment

### ✅ Production Checklist

**⚙️ Backend**
- [ ] Rotate `JWT_SECRET_KEY` to a strong random value
- [ ] Set `FLASK_ENV=production`
- [ ] Deploy with a production WSGI server (e.g. Gunicorn + Nginx)
- [ ] Enable HTTPS / TLS termination
- [ ] Configure CORS to your exact production origins
- [ ] Set up log rotation and error alerting

**🎨 Frontend**
- [ ] Run production build (`npm run build`)
- [ ] Deploy `dist/` to your CDN or static host
- [ ] Point `API_BASE_URL` to production backend
- [ ] Enforce HTTPS

**🗄️ Database**
- [ ] Change all default credentials
- [ ] Enable SSL connections
- [ ] Schedule automated backups
- [ ] Restrict DB access to backend servers only
- [ ] Enable slow query logging

---

## 🗺️ Roadmap

### 🔜 Coming Soon
- [ ] 🔑 Two-factor authentication (2FA) for admin
- [ ] 👥 Role-based access control (RBAC)
- [ ] 📧 Email & SMS transaction notifications
- [ ] 🔁 Webhook delivery engine with retry logic
- [ ] ⚡ Real-time transaction notifications (WebSocket)

### 📅 Planned
- [ ] 📤 Export reports to CSV and PDF
- [ ] 📊 Advanced routing analytics dashboard
- [ ] 🔢 API rate limiting per partner
- [ ] 🔐 Password reset and self-service account management
- [ ] 📱 Mobile app for admin monitoring
- [ ] 🤖 AI-powered anomaly detection for fraud signals
- [ ] 🌍 Multi-currency and FX rate management
- [ ] 📜 Partner-facing transaction portal
- [ ] 🔗 Settlement automation and reconciliation engine

---

## 📚 Documentation

| Document | Description |
|---|---|
| 🚀 Quick Start Guide | Get the platform running in minutes |
| 🏗️ System Architecture | Deep-dive into the platform design |
| 🔐 Security Overview | Auth flows, policies, and best practices |
| 🔌 Partner API Reference | Full API spec for integration partners |
| ⚙️ Configuration Guide | Environment and gateway configuration |
| 📋 Session Management | Session expiry and refresh behavior |

> 📬 Contact the platform team for access to full API documentation and partner onboarding guides.

---

## 🤝 Contributing

One_Money follows a structured development process:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`feature/your-feature-name`)
3. ✅ Write tests for your changes
4. 💬 Submit a pull request with a clear description
5. 🔍 Await code review and approval

---

## ⚠️ Disclaimer

This platform is proprietary software. The codebase, architecture, and API design are confidential. Do not share credentials, internal endpoints, or gateway configurations in public channels or repositories.

---

## 📄 License

**Proprietary** — One_Money Payment Orchestration Platform. All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited.

---

<div align="center">

**💸 One_Money — One API. Every Gateway. Zero Compromise.**

<sub>Built for reliability, scale, and security.</sub>

</div>
