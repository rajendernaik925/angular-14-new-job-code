# Copilot Instructions for iConnect Angular Codebase

## Project Overview
- This is a large Angular-based HR/workforce management application (see `src/app/` for modules like hiring, employee, dashboard, etc.).
- The app uses Angular forms, custom components, and a modular structure for features (e.g., `hiring-module`, `employee-assert-module`).
- Data flows via Angular services (see `src/app/services/`), with state often managed in components and passed via `@Input`/`@Output` or service observables.

## Key Patterns & Conventions
- **Component Structure:**
  - Each feature/module has its own folder under `src/app/` (e.g., `hiring-module/onboarding-data/`).
  - Components use `.component.ts`, `.component.html`, `.component.css`/`.sass`, and `.component.spec.ts` files.
  - Forms are built with Angular Reactive Forms (`formGroup`, `formControlName`).
- **Custom Controls:**
  - Custom elements like `<c-multi-select>` are used for advanced form controls. Check for their implementation in `src/app/components/` or shared modules.
- **Routing:**
  - Routing is managed in `app-routing.module.ts` and feature modules.
- **Styling:**
  - Uses both global (`src/styles.css`, `src/styles.sass`) and component-level styles.
  - Font and icon assets are in `assets/`.
- **Environment Config:**
  - API endpoints and environment-specific settings are in `src/environments/`.

## Developer Workflows
- **Build:**
  - Use `ng build` for production builds. Configurations are in `angular.json`.
- **Serve:**
  - Use `ng serve` for local development.
- **Test:**
  - Run `ng test` for unit tests (Karma/Jasmine, see `karma.conf.js`).
- **Lint:**
  - Use `ng lint` (see `tslint.json`).

## Integration & Data
- **APIs:**
  - Backend integration is via Angular services (see `src/app/services/`).
  - Environment variables for API URLs are in `src/environments/environment.ts`.
- **Assets:**
  - Static files (images, fonts, uploads) are in `src/assets/`.

## Project-Specific Notes
- **Form Validation:**
  - Custom validators and error messages are common (see form controls in `.component.html`).
- **Role-based UI:**
  - UI sections and navigation are conditionally rendered based on user roles/status (see `activeTab`, `editButtonDisplay` usage).
- **Mobile/Desktop Layouts:**
  - Responsive design with separate mobile and desktop navigation/components.

## Examples
- To add a new feature, create a folder in `src/app/`, scaffold with Angular CLI, and register in `app.module.ts`.
- For a new API integration, add a service in `src/app/services/`, inject it in the relevant component, and use environment config for URLs.

---
For more details, see `README.md` and `angular.json`.