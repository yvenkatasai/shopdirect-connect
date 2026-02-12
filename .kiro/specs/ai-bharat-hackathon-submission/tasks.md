# Implementation Plan: AI for Bharat Hackathon Submission

## Overview

This implementation plan documents the existing Local Hardware marketplace application for the AI for Bharat Hackathon Phase 2 submission. The application is already implemented using React, TypeScript, and Supabase. These tasks represent the work that has been completed to build the platform.

**Note**: This is a documentation spec for an existing implementation. The tasks below describe what has been built, not what needs to be built.

## Tasks

- [ ] 1. Project Setup and Infrastructure
  - Initialize React + TypeScript + Vite project with Shadcn/ui components
  - Configure Tailwind CSS with custom theme
  - Set up Supabase client and TypeScript type generation
  - Configure ESLint, Vitest, and testing infrastructure
  - Set up environment variables for Supabase connection
  - _Requirements: Tech Stack, Infrastructure_

- [ ] 2. Database Schema and Security
  - [ ] 2.1 Create database tables and types
    - Create profiles table with language preference field
    - Create user_roles table with app_role enum (customer/vendor)
    - Create vendors table with shop information and delivery options
    - Create products table with sell/rent/both type support
    - Create orders table with status workflow and fulfillment types
    - Create order_items table with rental duration support
    - _Requirements: 2.3, 4.1, 5.1, 7.7, 8.1_
  
  - [ ] 2.2 Implement Row Level Security policies
    - Create RLS policy for profiles (users can only access own profile)
    - Create RLS policies for vendors (vendors manage own shop)
    - Create RLS policies for products (public read, vendor write)
    - Create RLS policies for orders (customer and vendor access)
    - _Requirements: 14.2, 14.3_
  
  - [ ] 2.3 Create database functions
    - Implement get_vendor_id_for_user function
    - Implement has_role function for role checking
    - _Requirements: 3.4_



- [ ] 3. Internationalization System
  - [ ] 3.1 Create translation system
    - Define Language type (en | te | hi)
    - Create translations dictionary with all UI strings
    - Implement translations for English, Telugu, and Hindi
    - Add native script support for Telugu and Devanagari
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [ ] 3.2 Implement LanguageContext
    - Create context with language state and translation function
    - Implement localStorage persistence for language preference
    - Add language selection tracking (isLanguageSelected flag)
    - Implement t() function with parameter substitution
    - _Requirements: 1.2, 1.3_
  
  - [ ]* 3.3 Write property tests for translation system
    - **Property 1: Language Persistence** - For any language selection, persisting should allow retrieval of same language
    - **Property 2: Translation Completeness** - For any translation key and language, t() should return text in selected language
    - **Property 3: Native Script Rendering** - For any Telugu/Hindi text, output should contain correct Unicode characters
    - **Validates: Requirements 1.2, 1.4, 1.5**

- [ ] 4. Authentication System
  - [ ] 4.1 Implement AuthContext
    - Create context with user, session, role, and loading state
    - Implement signUp function with email/password
    - Implement signIn function with credential validation
    - Implement signOut function with session cleanup
    - Implement selectRole function for role assignment
    - Add hasVendorShop flag for vendor setup tracking
    - _Requirements: 2.1, 2.2, 2.6, 3.1_
  
  - [ ] 4.2 Create Auth page component
    - Build dual-mode form for login and signup
    - Implement form validation with React Hook Form
    - Add localized error messages
    - Handle email verification flow
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [ ]* 4.3 Write property tests for authentication
    - **Property 6: Session Persistence** - For any authenticated session, browser restart should maintain auth state
    - **Property 7: Localized Error Messages** - For any auth error and language, error should be in user's language
    - **Validates: Requirements 2.6, 2.5**

- [ ] 5. User Profile Management
  - [ ] 5.1 Implement profile data model
    - Create TypeScript interfaces for profile data
    - Implement profile CRUD operations via Supabase
    - Add profile update functionality
    - _Requirements: 2.3, 2.4_
  
  - [ ] 5.2 Create Settings page
    - Build profile editing form
    - Add language selection dropdown
    - Implement logout functionality
    - Display user information
    - _Requirements: 2.4, 1.3_
  
  - [ ]* 5.3 Write property tests for profile management
    - **Property 5: Profile Data Round Trip** - For any profile update, save then retrieve should return equivalent data
    - **Validates: Requirements 2.3, 2.4**



- [ ] 6. Role-Based Access Control
  - [ ] 6.1 Create RoleSelection page
    - Build role selection UI with Customer and Vendor options
    - Implement role assignment via user_roles table
    - Add visual distinction between role types
    - Handle role selection errors
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 6.2 Implement role-based routing
    - Create route guards based on user role
    - Redirect unauthenticated users to Auth page
    - Redirect users without role to RoleSelection
    - Redirect vendors without shop to VendorSetup
    - Implement separate route trees for Customer and Vendor
    - _Requirements: 3.4, 3.5_
  
  - [ ]* 6.3 Write property tests for access control
    - **Property 8: Customer Route Access** - For any customer user, customer routes should be accessible and vendor routes blocked
    - **Property 9: Vendor Route Access** - For any vendor user with shop, vendor routes should be accessible and customer routes blocked
    - **Validates: Requirements 3.2, 3.3, 3.4**

- [ ] 7. Vendor Shop Management
  - [ ] 7.1 Create VendorSetup page
    - Build shop setup form with all required fields
    - Implement category multi-select
    - Add delivery options configuration
    - Handle shop creation via vendors table
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 7.2 Implement shop update functionality
    - Add shop settings page
    - Implement shop status toggle (open/closed)
    - Allow shop information updates
    - Handle delivery configuration changes
    - _Requirements: 4.4, 4.5_
  
  - [ ]* 7.3 Write property tests for shop management
    - **Property 10: Shop Data Completeness** - For any shop creation, record should contain all required fields
    - **Property 11: Delivery Conditional Validation** - For any shop with delivery_available=true, delivery_charge and estimated_delivery_time should be non-null
    - **Validates: Requirements 4.1, 4.3**

- [ ] 8. Product Catalog Management
  - [ ] 8.1 Create VendorAddProduct page
    - Build product creation form with all fields
    - Implement product type selection (sell/rent/both)
    - Add conditional rental pricing fields
    - Implement image upload to Supabase Storage
    - Handle product creation with vendor association
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 8.2 Create VendorInventory page
    - Display product list with stock levels
    - Implement stock update functionality
    - Add product activation/deactivation toggle
    - Show low stock warnings
    - _Requirements: 11.1, 11.2, 11.4_
  
  - [ ] 8.3 Implement product data model
    - Create TypeScript interfaces for products
    - Implement product CRUD operations
    - Add stock availability calculation
    - Handle product specifications as JSON
    - _Requirements: 5.4, 5.6, 5.7_
  
  - [ ]* 8.4 Write property tests for product management
    - **Property 12: Product-Vendor Association** - For any product created by vendor, vendor_id should match vendor's shop id
    - **Property 13: Product Required Fields** - For any product creation, record should contain name, category, type, and stock
    - **Property 14: Rental Product Validation** - For any product with type rent/both, should have rental price and deposit
    - **Property 15: Stock Availability Consistency** - For any product, stock=0 implies in_stock=false, stock>0 implies in_stock=true
    - **Validates: Requirements 4.6, 5.1, 5.2, 5.4, 5.6**



- [ ] 9. Customer Product Discovery
  - [ ] 9.1 Create Index (home) page
    - Build category navigation section
    - Display nearby shops with delivery info
    - Implement search functionality
    - Show featured rental tools section
    - Add shop status indicators (open/closed)
    - _Requirements: 6.1, 6.2_
  
  - [ ] 9.2 Create ShopList page
    - Display all shops with filtering
    - Show shop categories and delivery options
    - Implement shop search
    - Add shop rating display (future feature)
    - _Requirements: 6.1_
  
  - [ ] 9.3 Create ShopDetail page
    - Display shop information and operating status
    - Show product catalog with filtering
    - Implement product search within shop
    - Display delivery/pickup options
    - _Requirements: 6.4_
  
  - [ ] 9.4 Create ProductDetail page
    - Display product images and description
    - Show pricing for buy and rent options
    - Display stock availability status
    - Implement rental duration selection
    - Add quantity selector
    - Show rental deposit information
    - _Requirements: 6.5, 6.6_
  
  - [ ]* 9.5 Write property tests for product discovery
    - **Property 4: Price Formatting** - For any price value, formatted output should include ₹ symbol and proper separators
    - **Validates: Requirements 1.6**

- [ ] 10. Shopping Cart System
  - [ ] 10.1 Implement CartContext
    - Create cart state with items array
    - Implement addItem function with rental support
    - Implement removeItem and updateQuantity functions
    - Calculate totalItems and totalPrice
    - Handle rental duration selection
    - _Requirements: 7.1, 7.2_
  
  - [ ] 10.2 Create Cart page
    - Display cart items grouped by shop
    - Show subtotals per shop
    - Calculate delivery charges per shop
    - Display rental deposits
    - Implement order placement form
    - Add fulfillment type selection (delivery/pickup)
    - Handle customer contact details
    - _Requirements: 7.3, 7.4, 7.5, 7.6_
  
  - [ ] 10.3 Implement order creation
    - Create order records in orders table
    - Create order_items records with rental info
    - Handle rental start/end date calculation
    - Clear cart after successful order
    - _Requirements: 7.7_
  
  - [ ]* 10.4 Write property tests for cart and orders
    - **Property 16: Cart Item Addition** - For any product and vendor, adding to cart should result in cart containing item with correct ids
    - **Property 17: Cart Subtotal Calculation** - For any cart state, sum of (price × quantity) per vendor should equal vendor subtotal
    - **Property 18: Order Total Calculation** - For any cart, order total should equal sum of items + delivery charges + deposits
    - **Property 19: Order Creation Completeness** - For any order placement, created record should have all required fields populated
    - **Validates: Requirements 7.1, 7.3, 7.4, 7.7**



- [ ] 11. Vendor Order Management
  - [ ] 11.1 Create VendorDashboard page
    - Display order statistics (today's orders, revenue, pending)
    - Show order list with status filters
    - Implement order status update actions
    - Add quick actions for order fulfillment
    - Display order details with customer info
    - _Requirements: 8.1_
  
  - [ ] 11.2 Implement order status workflow
    - Create status update functions for all transitions
    - Implement pending → confirmed transition
    - Implement confirmed → preparing transition
    - Implement preparing → out_for_delivery transition
    - Implement preparing → ready_for_pickup transition
    - Implement delivery/pickup → completed transition
    - Implement cancellation from any status
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ]* 11.3 Write property tests for order management
    - **Property 20: Order Status Transitions** - For any order, valid transitions should be pending→confirmed→preparing→(delivery|pickup)→completed, any→cancelled
    - **Property 21: Order Visibility to Vendor** - For any order with matching vendor_id, order should appear in vendor's dashboard
    - **Property 22: Order Status Synchronization** - For any order status update, updated status should be immediately visible to customer
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.1, 8.8**

- [ ] 12. Customer Order Tracking
  - [ ] 12.1 Create CustomerOrders page
    - Display all customer orders with current status
    - Show order details including items and quantities
    - Display rental duration and return dates for rentals
    - Organize orders by status
    - Show order timeline with timestamps
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 12.2 Write unit tests for order tracking
    - Test order list rendering
    - Test status filtering
    - Test rental date display
    - Test order detail expansion
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 13. Rental Marketplace
  - [ ] 13.1 Create Rentals page
    - Display all rental products across shops
    - Implement rental product filtering
    - Show rental pricing for all durations
    - Display deposit information
    - Add search functionality for rental tools
    - _Requirements: 9.1, 9.2_
  
  - [ ] 13.2 Implement rental order handling
    - Calculate rental costs based on duration
    - Track rental start and end dates
    - Handle deposit calculation
    - _Requirements: 9.3, 9.4_
  
  - [ ]* 13.3 Write property tests for rental system
    - **Property 23: Rental Product Filtering** - For any rental query, results should only include products with type rent or both
    - **Property 24: Rental Cost Calculation** - For any rental order item, total should equal (rental_price × quantity) + (deposit × quantity)
    - **Property 25: Rental Date Tracking** - For any rental order item, both start_date and end_date should be non-null
    - **Validates: Requirements 9.1, 9.3, 9.4**



- [ ] 14. UI Components and Navigation
  - [ ] 14.1 Create LanguageSelection page
    - Display language options with native script names
    - Implement language selection with visual feedback
    - Persist selection to localStorage
    - Redirect to Auth after selection
    - _Requirements: 1.1, 1.2_
  
  - [ ] 14.2 Create BottomNav component
    - Implement mobile-first bottom navigation
    - Add navigation items for Home, Shops, Rentals, Cart, Orders, Settings
    - Show active state for current route
    - Display cart item count badge
    - _Requirements: 12.2_
  
  - [ ] 14.3 Implement responsive layout
    - Create mobile-first responsive design
    - Implement touch-friendly UI elements
    - Add proper spacing for touch targets
    - Ensure proper rendering across screen sizes
    - _Requirements: 12.1, 12.3_
  
  - [ ]* 14.4 Write unit tests for UI components
    - Test LanguageSelection renders all options
    - Test BottomNav shows correct active state
    - Test responsive layout breakpoints
    - Test touch target sizes
    - _Requirements: 1.1, 12.2, 12.3_

- [ ] 15. Performance Optimization
  - [ ] 15.1 Implement code splitting
    - Add route-based lazy loading
    - Implement dynamic imports for heavy components
    - Configure Vite code splitting
    - _Requirements: 13.2_
  
  - [ ] 15.2 Optimize images and assets
    - Implement lazy loading for images
    - Add image compression
    - Configure CDN caching headers
    - Use WebP format where supported
    - _Requirements: 13.4_
  
  - [ ] 15.3 Implement caching strategy
    - Configure TanStack Query cache settings
    - Add localStorage caching for translations
    - Implement service worker for offline support
    - _Requirements: 13.3_
  
  - [ ]* 15.4 Write performance tests
    - Test bundle size is under target
    - Test initial load time
    - Test image lazy loading
    - Test cache hit rates
    - _Requirements: 13.1, 13.2, 13.4_

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.



- [ ] 17. Deployment and Infrastructure
  - [ ] 17.1 Configure Vercel deployment
    - Set up Vercel project
    - Configure environment variables
    - Set up automatic deployments from git
    - Configure build settings
    - _Requirements: Infrastructure_
  
  - [ ] 17.2 Configure Supabase production
    - Set up production Supabase project
    - Apply database migrations
    - Configure RLS policies
    - Set up storage buckets
    - Configure authentication settings
    - _Requirements: Infrastructure, 14.2_
  
  - [ ] 17.3 Set up monitoring
    - Configure error tracking (Sentry)
    - Set up performance monitoring
    - Configure analytics
    - Set up uptime monitoring
    - _Requirements: Infrastructure_
  
  - [ ]* 17.4 Write deployment tests
    - Test production build succeeds
    - Test environment variables are set
    - Test database connection
    - Test authentication flow
    - _Requirements: Infrastructure_

- [ ] 18. Documentation and Hackathon Submission
  - [ ] 18.1 Create README documentation
    - Document project setup instructions
    - Add feature list and screenshots
    - Document tech stack and architecture
    - Add deployment instructions
    - Include hackathon-specific information
    - _Requirements: All_
  
  - [ ] 18.2 Prepare hackathon submission materials
    - Create demo video showcasing features
    - Prepare presentation slides
    - Document USPs for AI for Bharat
    - Highlight multilingual support and rural accessibility
    - Document future AI integration roadmap
    - _Requirements: All_
  
  - [ ] 18.3 Create user documentation
    - Write customer user guide
    - Write vendor user guide
    - Document common workflows
    - Add troubleshooting section
    - _Requirements: All_

- [ ] 19. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster documentation
- Each task references specific requirements for traceability
- Checkpoints ensure validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- This is a documentation spec - the implementation already exists

## Testing Summary

### Property-Based Tests (27 properties)
- Translation and localization: 4 properties
- Authentication and profiles: 3 properties
- Access control: 2 properties
- Shop and product management: 6 properties
- Cart and orders: 4 properties
- Order management: 3 properties
- Rental system: 3 properties
- Inventory: 2 properties

### Unit Tests
- UI component tests
- Form validation tests
- Error handling tests
- Integration tests for user flows
- Performance tests

### Test Configuration
- Framework: Vitest + React Testing Library
- Property Testing: fast-check
- Minimum 100 iterations per property test
- Coverage target: > 80%
- Each property test tagged with feature name and property number
