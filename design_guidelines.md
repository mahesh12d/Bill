# Design Guidelines: Mahesh Electrical Engineers Rate Card Application

## Design Approach
**System-Based Design**: Using Material Design principles adapted for professional business documentation. This utility-focused application prioritizes clarity, readability, and professional presentation over visual flair.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, highly legible
- **Company Name/Headers**: 32px, Semi-bold (600)
- **Section Titles**: 20px, Medium (500)
- **Table Headers**: 14px, Semi-bold (600), Uppercase tracking
- **Table Content**: 14px, Regular (400)
- **Notes/Fine Print**: 12px, Regular (400)

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Container: max-w-6xl centered
- Section padding: py-8 to py-12
- Card/Table padding: p-6
- Element spacing: gap-4 standard, gap-6 for major sections

### Component Structure

**Header Section**:
- Company logo/name prominently displayed (left-aligned)
- Subtitle: "Electrical Services - Professional Rate Card"
- Contact information (phone, email) in header right
- Subtle border-bottom separator

**Rate Card Table**:
- Full-width responsive table with clean borders
- Column structure: Sr. No. (narrow) | Description (wide) | Labor Work | Material Specs | Rate with Material
- Alternating row backgrounds for readability (subtle gray/white)
- Bold pricing in dedicated column
- Special rows (quoted separately) with distinct styling
- Sticky header on scroll

**Notes/Terms Section** (below table):
- Grid layout (2 columns on desktop, 1 on mobile)
- Sections: Material Basis, Warranty Details, Exclusions, GST Terms
- Light background box with border
- Bullet points for clarity

**Footer**:
- Company registration details
- Small tagline: "Quality Electrical Solutions Since [Year]"
- Print/Export button (top-right of page)

### Visual Treatment
- Professional blue accent (#1E40AF) for headers and borders
- Neutral grays for backgrounds (#F9FAFB for alternating rows)
- Black text (#111827) for maximum readability
- Crisp 1px borders throughout (#E5E7EB)
- Minimal shadows (only on main container: shadow-sm)

### Responsive Behavior
- Desktop: Full table layout
- Tablet/Mobile: Stack table into card format per service item
- Maintain print-friendly layout at all breakpoints

### Images
No hero image needed - this is a professional document application. Consider small company logo/brand mark in header only.

**Print Optimization**: Ensure clean black-and-white printing with proper page breaks and margins.