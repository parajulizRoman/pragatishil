# Branding & Theming

This project uses a centralized design system built on Tailwind CSS.

## Colors
Always use the `brand-*` utilities. **Do not use hex codes (e.g., `#E53935`) directly in components.**

-   **Red**: `brand-red` / `bg-brand-red` / `text-brand-red` (Primary, Energy)
-   **Blue**: `brand-blue` / `bg-brand-blue` / `text-brand-blue` (Trust, Democracy)
-   **Navy**: `brand-navy` / `bg-brand-navy` / `text-brand-navy` (Depth, Foundation)
-   **White**: `brand-white` / `bg-brand-white` (Cleanliness)

## Gradients
-   **Tri-color**: `bg-brand-tricolor` (Red top-left -> White -> Blue bottom-right)
-   **Gradient Button**: `bg-gradient-to-r from-brand-red to-brand-blue`

## Fonts
-   **Sans**: `font-sans` (Geist Sans)
-   **Mono**: `font-mono` (Geist Mono)

## Components
Use shared components located in `src/components/` to ensure consistency:
-   `<BrandButton />`: For all buttons (Primary, Secondary, Solid).
-   `<SectionHeader />`: For section titles with localized subheadings.

## Adding New Styles
1.  Check `tailwind.config.ts` first.
2.  If a new color is needed, add it to `tailwind.config.ts` as a token.
3.  Use the token in your component.
