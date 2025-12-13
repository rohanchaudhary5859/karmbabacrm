Phase 7 — Seller Performance Dashboard
-------------------------------------
What is included:
- Backend API for supplier metrics and boost campaigns
- Prisma schema updates (SupplierMetrics, BoostCampaign)
- Frontend pages: Dashboard, Boosts (React)
- Simple starter implementation: increment metrics endpoint, start boost campaign

Integration steps:
1. Merge the prisma schema additions into your main prisma/schema.prisma and run migration:
   npx prisma migrate dev --name add_performance_models
2. Copy backend files to your backend/src/ structure and mount the route:
   app.use('/api/performance', require('./routes/performance'));
3. Copy frontend pages into frontend/src/pages/performance and add routes.
4. Seed supplier metrics or call increment endpoint to create records, e.g.:
   POST /api/performance/supplier/supplier_demo/increment { "field":"dailyLeads", "amount":1 }
5. Start frontend and backend and open dashboard page.
