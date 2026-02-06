# Eternals Studio - Website Pages Outline

## 📂 Project Structure

```
EternalsStudio/
├── index.html                          # Home page (main landing page)
├── style.css                          # Global styles
├── script.js                          # Global JavaScript
├── components/
│   └── navbar/
│       ├── navbar.html                # Reusable navigation component
│       ├── navbar.css                 # Navigation styles
│       └── navbar.js                  # Navigation functionality
├── About/
│   ├── about.html                     # About Us page
│   ├── about.css                      # About page styles
│   └── about.js                       # About page functionality
├── Contact/
│   ├── contact.html                   # Contact page with form
│   ├── contact.css                    # Contact page styles
│   └── contact.js                     # Contact form handling
├── Portfolio/
│   ├── portfolio.html                 # Portfolio showcase page
│   ├── portfolio.css                  # Portfolio page styles
│   └── portfolio.js                   # Portfolio filtering logic
├── Services/
│   ├── services.html                  # Services listing page
│   ├── services.css                   # Services page styles
│   └── services.js                    # Services page functionality
└── Store/
    ├── store.html                     # E-commerce store page
    ├── store.css                      # Store page styles
    └── store.js                       # Shopping cart functionality
```

---

## 🏠 **HOME PAGE** (`index.html`)
**Purpose:** Main landing page introducing Eternals Studio

**Sections:**
- Hero section with tagline and CTA
- Stats showcase (13+ Projects, 1+ Testimonials, 6+ Team Members, 24/7 Support)
- Services overview grid
- Client testimonials
- Call-to-action sections

**Key Features:**
- Animated bubble background
- Gradient text effects
- Service cards with icons
- Statistics display
- Footer with all company info

---

## 📋 **ABOUT PAGE** (`About/about.html`)
**Purpose:** Company information and team overview

**Sections:**
- About hero with title
- Our Story
- Our Mission
- Our Team

**Key Features:**
- Scroll animations
- Gradient headings
- Clean, informative layout
- Professional presentation

---

## 📞 **CONTACT PAGE** (`Contact/contact.html`)
**Purpose:** Customer communication and inquiry form

**Sections:**
- Contact hero
- Contact information (Email, Phone, Support hours)
- Contact form

**Key Features:**
- Interactive contact form (Name, Email, Subject, Message)
- Contact details with icons
- Form validation
- Responsive two-column layout

**Contact Details:**
- Email: Eternalsanctuarygg@gmail.com
- Phone: (240) 523-3976
- Support: 24/7 Available

---

## 🎨 **PORTFOLIO PAGE** (`Portfolio/portfolio.html`)
**Purpose:** Showcase completed projects and work samples

**Sections:**
- Portfolio hero
- Category filters
- Project grid
- Call-to-action

**Key Features:**
- Filterable project gallery (All, Web Development, Graphic Design, 3D Modeling, Animation)
- Project cards with images and descriptions
- Category badges
- Hover effects and animations
- Intersection observer for scroll animations

**Categories:**
- Web Development
- Graphic Design
- 3D Modeling
- Animation

---

## 🛠️ **SERVICES PAGE** (`Services/services.html`)
**Purpose:** Detailed service offerings and capabilities

**Sections:**
- Services hero
- Service cards grid
- Call-to-action

**Services Offered:**
1. **Web Development**
   - Responsive Design
   - E-Commerce Solutions
   - Custom Web Apps
   - Performance Optimization

2. **Graphic Design**
   - Logo Design
   - Brand Identity
   - Marketing Materials
   - Social Media Graphics

3. **3D Modeling**
   - Product Visualization
   - Character Modeling
   - Architectural Renders
   - 3D Assets

4. **Motion Graphics**
   - 2D/3D Animation
   - Explainer Videos
   - Logo Animation
   - Visual Effects

5. **Branding**
   - Brand Strategy
   - Visual Identity
   - Brand Guidelines
   - Market Positioning

6. **Video Editing**
   - Video Editing
   - Color Grading
   - Sound Design
   - Post-Production

**Key Features:**
- Service cards with icons
- Feature lists with checkmarks
- "Learn More" buttons
- Scroll animations
- Links to contact for quotes

---

## 🛒 **STORE PAGE** (`Store/store.html`)
**Purpose:** E-commerce for digital products and templates

**Sections:**
- Store hero
- Category filters
- Product grid
- Shopping cart summary

**Product Categories:**
- Templates
- Graphics
- 3D Assets
- Presets

**Sample Products:**
- Website Template Pack ($49.99)
- Logo Design Bundle ($29.99)
- 3D Model Collection ($79.99)
- Color Grading Presets ($19.99)
- Social Media Templates ($24.99)
- Icon Pack Collection ($24.99)

**Key Features:**
- Product filtering by category
- Add to cart functionality
- Shopping cart with localStorage persistence
- Product badges (New, Popular, Sale)
- Price display with sale pricing
- Checkout process (placeholder)

---

## 🧭 **NAVIGATION COMPONENT** (`components/navbar/`)
**Purpose:** Consistent navigation across all pages

**Navigation Links:**
- Home → `/index.html`
- Services → `/Services/services.html`
- Portfolio → `/Portfolio/portfolio.html`
- Store → `/Store/store.html`
- About → `/About/about.html`
- Contact → `/Contact/contact.html`

**Features:**
- Active page highlighting
- Theme toggle (light/dark mode)
- Shopping cart button
- "Get Started" CTA button
- Responsive design
- Sticky positioning
- Dynamic loading via JavaScript

---

## 🎨 **Design System**

**Colors:**
- Primary Gradient: `#40e0d0` (Cyan) → `#8a7fd6` (Purple)
- Text Primary: `#2c3e50`
- Text Secondary: `#5a6c7d`
- Background: `#f5f7fa` → `#e8ecf1`

**Typography:**
- Font Family: System fonts (Segoe UI, Roboto, San Francisco)
- Headings: Bold, gradient text effects
- Body: Regular weight, good line-height

**Components:**
- Buttons: Gradient backgrounds, hover animations
- Cards: White backgrounds with shadow, hover lift effect
- Forms: Clean inputs with focus states
- Icons: SVG icons for scalability

---

## 🔗 **Navigation Flow**

```
HOME (index.html)
├─→ Services (Services/services.html)
│   └─→ Contact (for quotes)
├─→ Portfolio (Portfolio/portfolio.html)
│   └─→ Contact (start project)
├─→ Store (Store/store.html)
│   └─→ Checkout
├─→ About (About/about.html)
└─→ Contact (Contact/contact.html)
```

---

## 📱 **Responsive Breakpoints**

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px
- Small Mobile: < 480px

---

## ✨ **Interactive Features**

1. **Scroll Animations:** Fade-in and slide-up effects on scroll
2. **Hover Effects:** Transform and shadow changes on cards/buttons
3. **Filter Systems:** Portfolio and Store category filtering
4. **Shopping Cart:** Add to cart with localStorage persistence
5. **Theme Toggle:** Light/dark mode switching
6. **Form Validation:** Contact form validation
7. **Active Navigation:** Auto-highlight current page in navbar

---

## 🚀 **Future Enhancements**

- Payment gateway integration for Store
- Backend API for contact form submissions
- Admin panel for portfolio/product management
- Blog section
- Client login area
- Live chat support
- Newsletter subscription
- SEO optimization
- Analytics integration
