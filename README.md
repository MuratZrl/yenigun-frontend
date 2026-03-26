# 🏠 Yenigun Emlak

**Yenigun Emlak** is a modern real estate platform that digitizes property buying, selling, and renting processes in the Sakarya region of Turkey. Built on Next.js App Router architecture, it provides a comprehensive experience for both end users and administrators.

🔗 **Live Site:** [yenigunemlak.com](https://www.yenigunemlak.com)

---

## ✨ Features

### Public

- **Property Listings & Search** — Advanced filtering by price, area, rooms, location, and amenities
- **Map-Based Search** — Interactive property search with Google Maps and Leaflet integration
- **Property Detail Pages** — Photo gallery, video support, location map, advisor contact info
- **Category Browsing** — Dynamic category pages with category-specific filters
- **Responsive Design** — Mobile-first, fully adaptive across all devices
- **SEO Optimization** — Server-side metadata generation with ISR caching

### Admin Panel

- **Property Management** — Create, edit, archive, and bulk operations
- **Customer Management** — Customer list, detail pages, and notes system
- **Category Management** — Tree-based category editor with feature and facility definitions
- **Rental Contracts** — Contract tracking and management
- **SMS Panel** — SMS notification system
- **Statistics Dashboard** — Google Search Console integration, advisor stats, traffic analytics
- **Messaging** — Contact form responses and customer communication
- **Popup Management** — Promotional popup creation and management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Framer Motion 12 |
| **State Management** | Zustand 5, React Context |
| **HTTP** | Axios (interceptor-based, proxy architecture) |
| **Maps** | Google Maps API, Leaflet, React Leaflet |
| **Rich Text** | Quill / React Quill |
| **UI Components** | Lucide React, Swiper, React Select, React Toastify |
| **Authentication** | JWT-based, cookie + localStorage |
| **Analytics** | Google Search Console API integration |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── (public)/                 # Public pages
│   │   ├── ilanlar/              # Property listings
│   │   ├── ilan/[uid]/           # Property detail
│   │   ├── haritada-emlak-arama/ # Map-based search
│   │   ├── category/[id]/[slug]/ # Category pages
│   │   ├── login/                # Login page
│   │   ├── about/                # About
│   │   └── contact/              # Contact
│   ├── admin/                    # Admin panel
│   │   ├── emlak/                # Property management (CRUD)
│   │   ├── customers/            # Customer management
│   │   ├── admins/               # Admin management
│   │   ├── categories/           # Category management
│   │   ├── contracts/            # Rental contracts
│   │   ├── statistics/           # Statistics
│   │   ├── message/              # Messages
│   │   ├── sms-panel/            # SMS panel
│   │   └── popup/                # Popup management
│   └── api/gsc/                  # Google Search Console API
├── features/                     # Domain-based modules
│   ├── auth/                     # Authentication
│   ├── ilanlar/                  # Listings (api, hooks, model, ui)
│   ├── admin/                    # Admin CRUD operations
│   ├── home/                     # Homepage sections
│   ├── search/                   # Search functionality
│   ├── map/                      # Map page
│   └── theme/                    # Design system
├── components/                   # Shared components
│   ├── layout/                   # Navbar, Footer, Breadcrumb, AdminLayout
│   ├── modals/                   # Modal components
│   └── ui/                       # MapComponent, RichTextEditor, etc.
├── context/                      # React Context providers
├── providers/                    # Client provider wrapper
├── lib/                          # API client, auth helpers
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
└── data/                         # Static data files
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x (pinned via Volta)
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MuratZrl/yenigun-frontend.git
cd yenigun-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your own values

# 4. Start the development server
npm run dev
```

### Environment Variables

Configure the following in your `.env.local` file:

```env
BACKEND_API=http://localhost:3000/backend
NEXT_PUBLIC_BACKEND_API=/backend
NEXT_PUBLIC_IMAGE_URL=https://api.yenigunemlak.com/public/

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_JAVASCRIPT_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY=

# Google Search Console (Admin Statistics)
GSC_SITE_URL=https://www.yenigunemlak.com
GSC_CLIENT_EMAIL=
GSC_PRIVATE_KEY=
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server (port 3018) |
| `npm run lint` | Run ESLint code checks |

---

## 🏗️ Architecture

- **Feature-Based Modularization** — Each domain (listings, admin, home) is encapsulated with its own `api/`, `model/`, `hooks/`, and `ui/` layers
- **Server/Client Separation** — Client components are explicitly marked with `.client.tsx` suffix
- **API Proxy Architecture** — Frontend requests go through `/backend/*`, rewritten to the external API via Next.js rewrites
- **Dynamic Forms** — Categories define custom attributes/fields; forms are generated dynamically
- **ISR Caching** — Static content is regenerated at 60–300 second intervals

---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push your branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for private use. All rights reserved.
