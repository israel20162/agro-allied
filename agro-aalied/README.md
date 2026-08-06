# Ameer Farms & Agro Allied Enterprises — MVP

A mobile-first foodstuff ordering site for Shop 20, Jaja Shopping Complex, UNILAG.
Students order or upload a shopping list, pay before pickup, and collect in about 15 minutes.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Formik + Yup · Supabase (database, storage, auth)

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the whole of `supabase/schema.sql`, and run it.
   That creates the tables, row level security policies, the two storage buckets,
   the public order-lookup function, and a starter shelf of 16 products.
3. Go to **Authentication → Users → Add user** and create one account for shop staff
   (email + password). That account is the admin login. Repeat for each staff member.
4. Copy your project URL and anon key from **Project Settings → API**.

## 2. Run the site

```bash
npm install
cp .env.example .env      # then paste your Supabase URL and anon key into .env
npm run dev
```

Open the printed localhost address. Build for production with `npm run build`.

## 3. Fill in the real business details

Open `src/lib/config.ts` and replace the placeholders:

- `BUSINESS.whatsapp` — the shop's WhatsApp number, digits only, starting with 234
- `PAYMENT_ACCOUNTS` — the real OPay and Moniepoint account numbers
- `CATEGORIES` — add or remove shelf categories

Product names and prices are managed from the admin dashboard, not in code.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, how it works, six items from the shelf |
| `/shop` | Full shelf with search, category filter, quantity selector, add to cart |
| `/cart` | Review items, change quantities, see the total |
| `/checkout` | Name + phone only, OPay/Moniepoint accounts, receipt upload, order number |
| `/order/:orderNumber` | Order number and live status, polled every 20 seconds |
| `/track` | Look up any order by its number |
| `/upload-list` | Photo of a handwritten shopping list + name and phone |
| `/admin/login` | Staff sign-in (Supabase Auth) |
| `/admin` | Orders: today / active / all, search by phone, status buttons, receipts and list photos |
| `/admin/products` | Add, edit, remove products; toggle stock; upload photos |

## Order flow

```
pending  →  paid  →  almost_ready  →  ready  →  completed
```

In the dashboard:

- **Confirm payment** moves an order from pending to paid.
- **ALMOST READY** (red) sets `almost_ready` and opens WhatsApp with a message telling
  the customer to allow about 2 more minutes.
- **READY FOR PICKUP** (green) sets `ready` and opens WhatsApp with the pickup message.
- **Mark picked up** closes the order.

Message wording lives in `statusMessage()` in `src/lib/helpers.ts`.

---

## Project layout

```
src/
  lib/
    config.ts       business details, payment accounts, categories  ← edit first
    supabase.ts     Supabase client
    types.ts        Product, Order, OrderItem, CartItem
    helpers.ts      naira formatting, order numbers, WhatsApp links, uploads
  context/
    CartContext.tsx cart state, saved to localStorage
  components/       Navbar, Footer, Layout, ProductCard, QuantityStepper,
                    FileInput, StatusBadge, WhatsAppButton
  pages/            Home, Shop, Cart, Checkout, OrderConfirmation, TrackOrder,
                    UploadList, NotFound
  pages/admin/      AdminLogin, RequireStaff, AdminLayout, AdminOrders, AdminProducts
supabase/
  schema.sql        run once in the Supabase SQL editor
```

Colours live in one place: the `leaf` palette in `tailwind.config.js`. Shared button,
card, and input classes live in `src/index.css`.

## Deploying

Vercel or Netlify both work with no configuration beyond:

- Build command `npm run build`, output directory `dist`
- Environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- A rewrite sending all paths to `/index.html` so client-side routes work on refresh

Point `ameerfarmsunilag.com` at the deployment once it is live.

---

## What a developer should tighten before real money moves

This is an MVP, so a few things are deliberately simple:

1. **Payment is manual.** The customer transfers and uploads proof; staff confirm by eye.
   Swapping in Paystack or Flutterwave webhooks would confirm payment automatically.
2. **Storage buckets are public-read.** Receipt screenshots are reachable by anyone with
   the URL. Make the `uploads` bucket private and serve signed URLs to staff instead.
3. **Anyone signed in counts as staff.** If the same Supabase project ever gains customer
   accounts, add a `profiles` table with a role column and check it in the RLS policies.
4. **Order totals are calculated in the browser.** A database trigger that recomputes the
   total from `order_items` would stop a tampered client from underpaying.
5. **Status updates poll every 20 seconds.** Supabase Realtime is a small change from here,
   and web push notifications after that — the status field and phone number are already stored.
6. **Order numbers are random.** Collisions are unlikely but not impossible; the unique
   constraint will reject one. Retrying on conflict would handle it cleanly.
