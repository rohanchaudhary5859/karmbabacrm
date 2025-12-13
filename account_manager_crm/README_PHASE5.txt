
Phase 5 — Account Manager CRM (Hybrid Assignment)
------------------------------------------------
This package includes:
- Prisma schema updates for AccountManager, SupplierAssignment, LeadQualification, FollowUp, PerformanceReport
- Backend routes and controllers for hybrid assignment workflow
- Frontend manager pages (Dashboard, SupplierDetail, LeadQualify, FollowUps)
- Prisma client helper

Integration steps:
1. Merge prisma schema into your main schema.prisma and run migrations.
2. Copy backend files into your backend/src/ folder and mount the route:
   app.use('/api/account-manager', require('./routes/accountManager'));
3. Copy frontend pages into frontend/src/pages/manager and add routes in your app.
4. Seed some AccountManager records to test auto-suggestion.
5. Use /assign/suggest to get a manager suggestion, then /assign/confirm to assign.

Hybrid assignment logic:
- suggestManager: finds managers with zone match and least assignments
- confirmAssignment: admin confirms and assignment saved
