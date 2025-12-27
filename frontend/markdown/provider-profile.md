Redesign the Profile Page (X/profile) to match a clean, modern, mobile-style UI theme similar to the reference design (centered phone-like card, teal accents, rounded shapes, soft shadows, clean typography).

The redesign must follow the provided documentation exactly.

🧩 Tech Requirements

React 19 + JavaScript (no TypeScript)

Vite

TailwindCSS 3.4+

shadcn/ui components

lucide-react icons

Data fetching logic must remain unchanged

Use semantic design tokens:

bg-background

bg-card

text-foreground

text-muted-foreground

border-border

bg-primary

text-primary-foreground

🧱 High-Level Design Requirements

1. Centered Mobile-Style Provider Card

Wrap the entire profile content in a centered container styled like a phone screen.

```html
<div class="min-h-screen bg-muted/40">
  <div class="mx-auto max-w-md lg:max-w-lg px-4 py-6">
    <!-- Provider Profile Card -->
  </div>
</div>
```

Card styling:

```html
<div class="bg-card border border-border rounded-3xl shadow-lg p-4 sm:p-6">
```

2.Sticky Header (Top)

A modern floating header with blur + border.

Left: Back button

Center: "Provider Profile"

Right: Share + Heart icons

```html
<header class="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
```

Use Button variant="ghost" size="icon" with rounded-full icons.

3.Profile Section (Centered)

Includes:

Large Avatar (96×96)

Provider Name (text-2xl font-semibold)

Category badges (rounded-full pills)

Rating row (star, score, review count)

Location & Member Since info (MapPin + Calendar icons)

4. Verification Badges, Stats & Pricing

Three logical groups:

🔹 Verification Badges Grid

Use Card components with soft styling.

🔹 Performance Stats Grid

Mobile: stacked
Tablet+: grid-cols-3

Each stat card uses:

```html
<Card class="rounded-2xl border border-border/60 shadow-sm">
  <CardContent>…</CardContent>
</Card>
```

🔹 Pricing Section

Includes:

Hourly rate: $30–50

Payment method pills: Cash, Bank Transfer, OMT

5. About / Languages / Availability Sections

Use consistent spacing:

```html
<div class="space-y-2 mb-4">
  <h3 class="text-base font-semibold">About</h3>
  <p class="text-sm text-muted-foreground leading-relaxed"></p>
</div>
<Separator />
```

6. Services Section

Title: "Services Offered"

Horizontal scroll cards on mobile

“See All” button opens Dialog

Service card structure: image, title, tags

7. Portfolio Section

2×2 grid on mobile

Larger grid for desktop

Clicking an image opens Dialog preview

8. Reviews Section

Review card structure:

Avatar

Name + star rating + date

Review text

Use:

```html
<Card class="rounded-2xl border border-border shadow-sm">
```

9. Bottom CTA Bar (Mobile Sticky)
```html
<div class="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 sm:static sm:border-none">
```

Buttons:

Message → outline

Book Now → primary, rounded-full, full-width on mobile

Price appears on desktop only.

🧪 Loading & Error States
Loading

Use the existing ProviderProfileSkeleton and update styling:

Rounded skeleton blocks

Soft spacing system

Matching card shape

Error

Use Card with destructive icon:

```html
<Card class="rounded-3xl border border-destructive/40">
```

📁 Output Requirements
You must return:
✅ Updated ProviderProfile.jsx

With:

Full UI redesign

Clean JSX structure

Subcomponents if beneficial

Tailwind classes

shadcn/ui components

Responsive layout

No breaking changes in API or state

❌ Do NOT change:

Data fetching logic

API structure

Routing

Provider transformation function