# Mahesh Electrical Engineers - Leisure Format & Billing Application

## Overview

This is a professional electrical services billing application for Mahesh Electrical Engineers. The application serves two primary purposes:

1. **Leisure Format Display**: View a standardized leisure format table containing pricing for electrical services (lighting, fans, power points, A.C. installation, etc.). The leisure format displays: serial number, description, labour work, material specifications, and rate with material.

2. **Bill Management**: Create, view, and manage customer bills with line items, automatic calculations, and print functionality.

The application is built as a full-stack web application using React for the frontend, Express as a proxy server, and FastAPI as the backend API, with PostgreSQL for data persistence. The design focuses on professional business documentation with clean, readable styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool

**UI Component Library**: Shadcn/ui (Radix UI primitives) with Tailwind CSS for styling
- Design system based on the "new-york" style variant
- Neutral color scheme with CSS variables for theming
- Comprehensive component library including forms, tables, dialogs, cards, and navigation elements

**Routing**: Wouter (lightweight client-side routing)
- Two main routes: `/leisure-items` (home) and `/bills`
- Simple Switch/Route structure without server-side rendering

**State Management**: 
- React Query (TanStack Query) for server state management
- React Hook Form with Zod validation for form handling
- Local component state using React hooks

**Key Design Principles**:
- Professional business documentation aesthetic
- Inter font family for clean, legible typography
- Responsive layout with mobile considerations
- Print-optimized styling for leisure format and bills

### Backend Architecture

**Server Framework**: Express.js with TypeScript (ESM modules)

**API Design**: RESTful JSON API with the following endpoints:

*Bills:*
- `GET /api/bills` - Retrieve all bills
- `GET /api/bills/:id` - Retrieve specific bill
- `GET /api/bills-next-number` - Get next available bill number
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update existing bill
- `DELETE /api/bills/:id` - Delete bill

*Leisure Items:*
- `GET /api/leisure-items` - Retrieve all leisure format items

**Request Handling**:
- JSON body parsing with raw body preservation for potential webhook integrations
- Request/response logging middleware for API endpoints
- Structured error handling with appropriate HTTP status codes

**Development Setup**:
- Vite integration for development with HMR (Hot Module Replacement)
- Custom middleware mode setup for seamless frontend/backend integration
- Static file serving for production builds

### Data Storage Solutions

**Current Implementation**: PostgreSQL database with SQLAlchemy ORM

**Database Schema**: 

*Bills Table:*
- `id`: UUID primary key (auto-generated)
- `bill_no`: Text field for bill number
- `date`: Text field for bill date
- `customer_name`: Text field
- `line_items`: JSONB array of line items (srNo, description, qty, rate, amount)
- `total`: Double precision for total amount
- `amount_in_words`: Text representation of total

*Leisure Items Table:*
- `id`: UUID primary key (auto-generated)
- `sr_no`: Integer for serial number (unique)
- `description`: Text field for service description
- `labor_work`: VARCHAR for labor cost
- `material_specs`: Text field for material specifications
- `rate_with_material`: VARCHAR for total rate with materials

**Data Validation**: Zod schemas for runtime type checking
- `billLineItemSchema`: Validates individual line items
- `insertBillSchema`: Validates bill creation/updates
- Integration with Drizzle for type-safe database operations

**Migration Strategy**: Drizzle Kit configured for schema migrations
- Migration files output to `./migrations` directory
- PostgreSQL dialect
- Database URL from environment variables

### Authentication and Authorization

**Current State**: No authentication implemented
- Application designed for single-user/internal business use
- No user management or access control

**Future Considerations**: If multi-user access is needed, consider adding:
- Session-based authentication
- Role-based access control for bill management
- Connect-pg-simple for PostgreSQL session storage (already in dependencies)

### External Dependencies

**UI & Styling**:
- Radix UI primitives (@radix-ui/*) - Accessible component primitives
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe variant management
- clsx & tailwind-merge - Conditional class name utilities
- cmdk - Command palette component
- embla-carousel-react - Carousel functionality

**Data & Forms**:
- React Hook Form - Form state management
- Zod - Schema validation
- @hookform/resolvers - Integration between React Hook Form and Zod
- date-fns - Date manipulation utilities

**Backend & Database**:
- Express - Web server framework
- Drizzle ORM - Type-safe SQL ORM
- @neondatabase/serverless - PostgreSQL driver for Neon/serverless environments
- connect-pg-simple - PostgreSQL session store (for future auth)

**Development Tools**:
- TypeScript - Type safety
- Vite - Build tool and dev server
- esbuild - JavaScript bundler for production builds
- tsx - TypeScript execution for development
- @replit/vite-plugin-* - Replit-specific development enhancements

**Fonts**: Google Fonts integration
- Inter - Primary font family
- Architects Daughter - Decorative font
- DM Sans - Alternative sans-serif
- Fira Code - Monospace font
- Geist Mono - Alternative monospace

**Print Functionality**: Native browser print with custom print stylesheets
- Print-specific CSS classes (print:hidden, print:p-0, etc.)
- Optimized bill layout for physical printing