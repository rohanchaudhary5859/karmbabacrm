# AI Implementation Rules for KARM BABA

## Tech Stack Overview

- **Frontend**: React with Vite, Tailwind CSS for styling, React Router for navigation
- **Backend**: Node.js with Express.js, Prisma ORM for database operations
- **Database**: SQLite for development, PostgreSQL for production (via Prisma)
- **AI Services**: Python with FastAPI for microservices, scikit-learn for ML models
- **Deployment**: Docker containers orchestrated with docker-compose
- **Authentication**: JWT-based authentication with role-based access control (RBAC)
- **Payment Processing**: Stripe and Razorpay integrations for subscription management
- **External Integrations**: LinkedIn OAuth, WhatsApp Business API, PhantomBuster for data scraping
- **Real-time Features**: Socket.IO for chat functionality
- **Document Generation**: Puppeteer for PDF generation in export system

## AI Library Usage Rules

### Lead Scoring & Matchmaking
- **Primary**: Use scikit-learn for all machine learning models
- **Implementation**: Create separate Python microservices with FastAPI endpoints
- **Model Persistence**: Use joblib for saving/loading trained models
- **Data Format**: Always use pandas DataFrames for data preprocessing

### Natural Language Processing
- **Templates**: Use Python's built-in string formatting for simple template-based generation
- **Advanced NLP**: Integrate transformers library only when template logic is insufficient
- **Response Generation**: Prefer lightweight solutions unless complex understanding is required

### Product Optimization
- **Heuristics**: Implement rule-based suggestions using pure Python logic
- **Scoring**: Use mathematical formulas for initial scoring algorithms
- **Complex Analysis**: Only integrate advanced ML models after validating heuristic approaches

### Data Handling
- **JSON**: Use Pydantic models for all API request/response validation
- **Data Exchange**: Always use JSON for communication between services
- **Preprocessing**: Apply consistent data cleaning and normalization before AI processing

### Model Training & Deployment
- **Training**: Implement training scripts separately from serving code
- **Versioning**: Maintain model versioning with clear file naming conventions
- **Health Checks**: Implement /health endpoints for all AI services
- **Error Handling**: Return meaningful error messages when models aren't properly loaded

### Integration Guidelines
- **API First**: All AI capabilities must be exposed through RESTful APIs
- **Asynchronous Processing**: Use background jobs for long-running AI tasks
- **Caching**: Implement Redis caching for frequently requested AI predictions
- **Monitoring**: Log all AI service requests for performance tracking and debugging