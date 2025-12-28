# Architecture Documentation

## Project Overview

### The Idea

This is a comprehensive stock market data collection and analysis platform designed to:

- **Collect and Store Stock Data**: Automatically gather stock ticker information and historical price data from external APIs
- **Scheduled Data Collection**: Implement intelligent scheduling to collect data systematically, managing API rate limits and ensuring complete historical coverage
- **Provide RESTful API**: Expose collected data through a well-structured REST API for client applications
- **User Management**: Support user authentication and authorization using JWT tokens
- **Real-time Processing**: Use event-driven architecture with Kafka for asynchronous data processing
- **Scalable Architecture**: Microservices-based design allowing independent scaling of API and data collection services

### Use Cases

1. **Stock Search**: Users can search for stock tickers by symbol or company name
2. **Historical Data Access**: Query daily and hourly price data for any tracked stock
3. **Automated Data Collection**: System automatically collects and updates stock data on schedule
4. **Multi-timeframe Analysis**: Support for both daily and 1-hour interval price data

## Tech Stack

### Monorepo & Build Tools

- **Nx**: Monorepo management and build orchestration
- **Yarn 4**: Package manager with workspace support
- **TypeScript 5.7**: Primary programming language across all services
- **Webpack**: Module bundler for applications

### Backend Technologies

- **NestJS 10**: Progressive Node.js framework for building scalable server-side applications
- **Node.js**: JavaScript runtime
- **Express**: HTTP server (via NestJS)
- **TypeORM 0.3**: ORM for database interactions
- **Class Validator & Class Transformer**: DTO validation and transformation

### Frontend Technologies

- **React 19**: UI library for building the web client
- **React DOM 19**: React renderer for web

### Data & Messaging

- **PostgreSQL 14**: Primary relational database
- **KafkaJS 2**: Apache Kafka client for event streaming
- **Kafka (Landoop Fast Data Dev)**: Message broker for inter-service communication

### Authentication & Security

- **Passport**: Authentication middleware
- **Passport JWT**: JWT authentication strategy
- **@nestjs/jwt**: NestJS JWT module
- **bcryptjs**: Password hashing

### External APIs

- **AlphaVantage API**: Stock market data provider
- **Axios**: HTTP client for external API calls

### DevOps & Infrastructure

- **Docker**: Container runtime
- **Docker Compose**: Multi-container orchestration
- **pgAdmin**: PostgreSQL administration tool

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────┐                                           │
│  │   Web Client     │  (React App - Port: TBD)                  │
│  │  (client-web)    │                                           │
│  └────────┬─────────┘                                           │
└───────────┼─────────────────────────────────────────────────────┘
            │ HTTP/REST
┌───────────▼─────────────────────────────────────────────────────┐
│                      API Layer (Port 3000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Service (NestJS)                   │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │    Auth    │  │   Ticker    │  │  Daily/Hourly   │  │  │
│  │  │  Module    │  │   Module    │  │  Price Modules  │  │  │
│  │  └────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └──────────────┬────────────────┬──────────────────────────┘  │
└─────────────────┼────────────────┼─────────────────────────────┘
                  │                │
                  │ Kafka          │ TypeORM
                  │ Messages       │
┌─────────────────▼────────────────▼─────────────────────────────┐
│                   Data & Messaging Layer                         │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   │
│  │   Kafka Message Bus     │   │   PostgreSQL Database    │   │
│  │   (Port 9092)           │   │   (Port 5432)            │   │
│  │                         │   │                          │   │
│  │  Topics:                │   │  Tables:                 │   │
│  │  - ticker-search        │   │  - users                 │   │
│  │  - price-data           │   │  - tickers               │   │
│  └────────▲────────────────┘   │  - daily_prices          │   │
│           │                     │  - one_hour_prices       │   │
│           │                     │  - scheduled_tickers     │   │
│           │                     │  - ticker_lists          │   │
│           │                     └──────────────────────────┘   │
└───────────┼──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│            Data Collection Layer (Port 3001)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Data Collector Service (NestJS)                 │   │
│  │  ┌──────────────────┐  ┌────────────────────────────┐   │   │
│  │  │ Ticker Collector │  │ Scheduled Ticker Collector │   │   │
│  │  │  (Kafka Consumer)│  │    (Cron: 0 1 * * *)       │   │   │
│  │  └──────────────────┘  └────────────────────────────┘   │   │
│  │  ┌──────────────────┐  ┌────────────────────────────┐   │   │
│  │  │ Daily Price      │  │ 1-Hour Price Collector     │   │   │
│  │  │ Collector        │  │                            │   │   │
│  │  └──────────────────┘  └────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │        Source Stocks API Service                 │   │   │
│  │  │      (AlphaVantage API Integration)              │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                   ┌─────────────────────┐
                   │  AlphaVantage API   │
                   │  (External Service) │
                   └─────────────────────┘
```

### Component Details

#### 1. API Service (`apps/api`)

**Purpose**: Main REST API service for client applications

**Port**: 3000

**Modules**:

- **Auth Module** (`/api/auth`)
  - User registration and authentication
  - JWT token generation and validation
  - Password hashing with bcrypt
  - Endpoints: `/register`, `/login`

- **Ticker Module** (`/api/ticker`)
  - Search for stock tickers by keywords
  - First searches local database, then falls back to Kafka message to data-collector
  - CRUD operations for ticker management
  - Endpoints: `/search`, `/symbol/:symbol`, `/:id`

- **Ticker List Module** (`/api/ticker-list`)
  - Manage user-specific ticker watchlists
  - Endpoints: TBD

- **Daily Price Module** (`/api/daily-price`)
  - Query daily price data for stocks
  - Filter by date ranges and ticker symbols
  - Trigger data collection for specific tickers
  - Endpoints: Query endpoints with date/ticker filters

- **One Hour Price Module** (`/api/one-hour-price`)
  - Query hourly (60-minute interval) price data
  - Similar filtering capabilities as daily prices
  - Scheduled data gathering support
  - Endpoints: Query endpoints with date/ticker filters

**Key Features**:
- JWT-based authentication with guards
- Kafka client integration for async messaging
- TypeORM for database access
- Global `/api` prefix for all endpoints

#### 2. Data Collector Service (`apps/data-collector`)

**Purpose**: Background service for collecting and processing stock market data

**Port**: 3001

**Modules**:

- **Ticker Collector Module**
  - Kafka consumer listening to ticker search requests
  - Fetches ticker data from AlphaVantage API
  - Stores ticker information in the database
  - Responds back to API service via Kafka

- **Scheduled Ticker Collector Module**
  - **Cron Schedule**: Runs daily at 1:00 AM (`0 1 * * *`)
  - Manages systematic data collection for all tracked tickers
  - Creates schedule entries for each month from oldest supported date to present
  - Processes scheduled entries in order, handling:
    - `READY`: Ready to be processed
    - `INCOMPLETED`: Current month (partial data)
    - `ERROR`: Failed collection attempts
    - `DONE`: Successfully completed months
  - Implements API rate limiting protection
  - Automatically retries errored entries

- **Daily Price Collector Module**
  - Collects full daily price history for tickers
  - Processes data from AlphaVantage TIME_SERIES_DAILY
  - Stores in `daily_price` table

- **One Hour Price Collector Module**
  - Collects intraday price data (60-minute intervals)
  - Processes data from AlphaVantage TIME_SERIES_INTRADAY
  - Stores in `one_hour_price` table
  - Handles monthly data retrieval for historical data

- **Source Stocks API Module**
  - Abstraction layer for AlphaVantage API
  - Implements rate limiting and error handling
  - Functions:
    - `SYMBOL_SEARCH`: Find tickers by keywords
    - `TIME_SERIES_DAILY`: Get daily price data
    - `TIME_SERIES_INTRADAY`: Get intraday data (60min intervals)
  - Handles API response transformation to internal DTOs

**Key Features**:
- Kafka microservice for event-driven communication
- Scheduled jobs using `@nestjs/schedule`
- Intelligent data collection scheduling
- Error recovery and retry mechanisms
- API rate limit management

#### 3. Models Package (`packages/models`)

**Purpose**: Shared TypeORM models, DTOs, and utilities

**Key Models**:

- **User**
  - Fields: email, passwordHash, firstName, lastName, isActive
  - Unique constraint on email

- **Ticker**
  - Fields: symbol, name, type, region, marketOpen, marketClose, timezone, currency
  - Unique constraint on symbol

- **Price** (Base class)
  - Fields: ticker (relation), open, high, low, close, volume, dateTime
  - Timestamp transformer for timezone handling
  - Extended by DailyPrice and OneHourPrice

- **DailyPrice**
  - Inherits from Price
  - Unique constraint on (dateTime, ticker)

- **OneHourPrice**
  - Inherits from Price
  - Unique constraint on (dateTime, ticker)

- **ScheduledTicker**
  - Fields: ticker (relation), status (enum), dateTime
  - Unique constraint on (dateTime, ticker)
  - Manages data collection schedule

- **TickerList**
  - User watchlist functionality

**DTOs**:
- `TickerDto`: Data transfer for ticker operations
- `PriceDto`: Data transfer for price data
- `PriceQueryDto`: Query parameters for price endpoints
- `ScheduledTickerQueryDto`: Query parameters for scheduled operations
- `AuthDto`: Authentication request data

**Shared Configurations**:
- TypeORM configuration factory
- Database connection settings
- Constants (e.g., `OLDEST_SUPPORTED_BY_API_DATE`, topic names)

#### 4. Web Client (`apps/client-web`)

**Purpose**: React-based web application (currently minimal implementation)

**Status**: Placeholder implementation with basic "Hello World"

**Future Capabilities**:
- User authentication UI
- Stock search and ticker management
- Price chart visualization
- Watchlist management
- Real-time data updates

### Infrastructure Components

#### PostgreSQL Database

**Container**: `stocks-db`
**Port**: 5432
**Image**: `postgres:14-alpine`

**Tables**:
- `user`: User accounts and authentication
- `ticker`: Stock ticker master data
- `daily_price`: Daily OHLCV (Open, High, Low, Close, Volume) data
- `one_hour_price`: Hourly OHLCV data
- `scheduled_ticker`: Data collection schedule and status
- `ticker_list`: User watchlists

**Features**:
- Automatic schema synchronization (configurable via `SYNC_DB`)
- Persistent data storage via Docker volumes
- pgAdmin for database administration (Port 5050)

#### Apache Kafka

**Container**: `stocks-kafka`
**Broker Port**: 9092
**Web UI Port**: 3040
**Image**: `landoop/fast-data-dev`

**Topics**:
- `ticker-search`: Ticker search requests and responses
- Additional topics for price data events

**Features**:
- Event-driven communication between services
- Asynchronous request-response pattern
- Built-in web UI for monitoring (Kafka development environment)

## Data Flow

### Ticker Search Flow

1. **Client Request**: User searches for a ticker via API
2. **Local Search**: API service queries PostgreSQL for matching tickers
3. **Cache Hit**: If found locally, return immediately
4. **Cache Miss**: If not found:
   - API publishes message to Kafka `ticker-search` topic
   - Data Collector consumes message
   - Data Collector queries AlphaVantage API
   - Results stored in PostgreSQL
   - Response sent back via Kafka
5. **Response**: API returns results to client

### Scheduled Data Collection Flow

1. **Cron Trigger**: Daily at 1:00 AM, scheduled ticker collector wakes up
2. **Query Schedule**: Find oldest `READY`, `INCOMPLETED`, or `ERROR` entry
3. **API Call**: Request intraday data for that ticker/month from AlphaVantage
4. **Process Data**: Transform API response to internal format
5. **Store Data**: Save price records to `one_hour_price` table
6. **Update Status**:
   - Set to `DONE` if month is complete
   - Set to `INCOMPLETED` if current month
   - Set to `ERROR` if API call failed
7. **Rate Limiting**: Stop if API limit exceeded, otherwise continue to next entry
8. **Repeat**: Process next scheduled entry until done or rate limited

### Price Data Query Flow

1. **Client Request**: Query daily or hourly prices via API
2. **Authentication**: Validate JWT token
3. **Query Database**: TypeORM query with filters (ticker, date range)
4. **Transform**: Convert database entities to DTOs
5. **Response**: Return formatted data to client

## Configuration

### Environment Variables

```bash
# JWT Authentication
JWT_SECRET=<secret>

# AlphaVantage API
STOCK_API_KEY=<apikey>

# PostgreSQL
POSTGRES_HOST=stocks-db
POSTGRES_USER=stocks-user
POSTGRES_PASSWORD=stocks-password
POSTGRES_PORT=5432
POSTGRES_DB=stocks-db

# pgAdmin
PGADMIN_PORT=5050
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=root

# Database Sync
SYNC_DB=1  # Auto-sync TypeORM schemas

# Kafka
KAFKA_HOST=stocks-kafka
KAFKA_PORT=9092
KAFKA_CLIENT_ID=stocks-data-client
KAFKA_CONSUMER_GROUP_ID=stocks-data-consumer

# Service Ports
API_PORT=3000
COLLECTOR_PORT=3001
```

## Deployment

### Local Development

1. **Install Dependencies**:
   ```bash
   yarn
   ```

2. **Start Infrastructure**:
   ```bash
   yarn docker:start
   ```
   This starts PostgreSQL, pgAdmin, and Kafka containers.

3. **Start All Services**:
   ```bash
   yarn start
   ```
   This runs both API and Data Collector services.

### Docker Services

- **PostgreSQL**: http://localhost:5432
- **pgAdmin**: http://localhost:5050
- **Kafka Web UI**: http://localhost:3040
- **API Service**: http://localhost:3000
- **Data Collector**: http://localhost:3001

## Design Patterns & Best Practices

### Microservices Architecture

- **Service Independence**: API and Data Collector can be deployed and scaled independently
- **Event-Driven**: Kafka enables asynchronous, decoupled communication
- **Shared Models**: Common package prevents code duplication

### Domain-Driven Design

- **Module per Domain**: Each NestJS module represents a bounded context (Auth, Ticker, Price)
- **Repository Pattern**: TypeORM repositories abstract data access
- **DTO Pattern**: Clear separation between API contracts and internal models

### Reliability & Error Handling

- **Retry Logic**: Scheduled collector retries errored entries
- **Rate Limiting**: Respects AlphaVantage API limits
- **Status Tracking**: ScheduledTicker statuses provide observability
- **Graceful Degradation**: Local cache (database) reduces external API dependency

### Security

- **JWT Authentication**: Stateless token-based auth
- **Password Hashing**: bcrypt with salt
- **Guard Pattern**: NestJS guards protect endpoints
- **Environment Variables**: Sensitive config externalized

## Scalability Considerations

### Current Limitations

1. **Single Instance**: No horizontal scaling implemented yet
2. **API Rate Limits**: AlphaVantage free tier has request limits
3. **Synchronous Scheduling**: Only one scheduled collector runs at a time

### Future Enhancements

1. **Horizontal Scaling**:
   - Multiple API service instances behind load balancer
   - Kafka consumer groups for parallel data collection
   - Redis for distributed caching and session management

2. **Performance Optimization**:
   - Database indexing on frequently queried fields
   - Materialized views for complex aggregations
   - CDN for static client assets
   - GraphQL for flexible client queries

3. **Data Management**:
   - Data partitioning by date ranges
   - Archive old data to cold storage
   - Real-time data streaming via WebSockets

4. **Monitoring & Observability**:
   - Application metrics (Prometheus)
   - Distributed tracing (Jaeger)
   - Centralized logging (ELK stack)
   - Health checks and alerts

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tickers

- `GET /api/ticker/search?keywords={query}` - Search tickers
- `GET /api/ticker/symbol/:symbol` - Get ticker by symbol
- `GET /api/ticker/:id` - Get ticker by ID
- `DELETE /api/ticker/:id` - Delete ticker

### Prices

- `GET /api/daily-price` - Query daily prices (with filters)
- `GET /api/one-hour-price` - Query hourly prices (with filters)
- `POST /api/daily-price/gather` - Trigger data collection
- `POST /api/one-hour-price/gather` - Trigger data collection

## External Dependencies

### AlphaVantage API

**Documentation**: https://www.alphavantage.co/documentation

**Used Endpoints**:
- `SYMBOL_SEARCH`: Search for ticker symbols
- `TIME_SERIES_DAILY`: Daily adjusted OHLCV data
- `TIME_SERIES_INTRADAY`: Intraday data (60min intervals)

**Rate Limits**:
- Free tier: 25 requests/day (as of documentation)
- Implementation handles `LIMIT_EXCEEDED_ERROR` gracefully

**Data Coverage**:
- Historical data available from configurable `OLDEST_SUPPORTED_BY_API_DATE`
- Intraday data provided in monthly chunks

## Development Workflow

### Monorepo Structure

```
stocks/
├── apps/
│   ├── api/                 # REST API service
│   ├── client-web/          # React web application
│   └── data-collector/      # Background data collection service
├── packages/
│   └── models/              # Shared TypeORM models and DTOs
├── docker/
│   └── data/                # Docker volume mounts
├── docker-compose.yml       # Infrastructure orchestration
├── nx.json                  # Nx configuration
├── package.json             # Root package configuration
└── tsconfig.base.json       # Shared TypeScript config
```

### Nx Commands

- `nx run-many -t serve` - Serve all applications
- `nx build <app-name>` - Build specific application
- `nx test <app-name>` - Run tests for specific application

### Code Organization

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Modules**: Group related controllers, services, and providers
- **Guards**: Protect routes with authentication/authorization
- **DTOs**: Define API contracts with validation
- **Models**: Define database schemas

## Maintenance & Operations

### Database Migrations

Currently using TypeORM's `synchronize` feature (controlled by `SYNC_DB` env var). For production:
- Disable auto-sync
- Use TypeORM migrations
- Version control migration files

### Monitoring Data Collection

1. **Check Scheduled Status**:
   - Query `scheduled_ticker` table
   - Monitor `ERROR` status entries
   - Track completion progress

2. **Kafka Monitoring**:
   - Access Kafka UI at http://localhost:3040
   - Monitor topic lag and throughput
   - Check consumer group status

3. **Database Health**:
   - Use pgAdmin at http://localhost:5050
   - Monitor table sizes and growth
   - Check index performance

### Troubleshooting

**Common Issues**:

1. **API Rate Limit Exceeded**:
   - Scheduled collector stops automatically
   - Check AlphaVantage account limits
   - Wait for daily limit reset

2. **Kafka Connection Issues**:
   - Verify `stocks-kafka` container is running
   - Check KAFKA_HOST and KAFKA_PORT configuration
   - Review broker logs

3. **Database Connection Errors**:
   - Verify `stocks-db` container is running
   - Check PostgreSQL credentials in `.env`
   - Ensure database is initialized

## Future Roadmap

### Phase 1: Core Features (Current)
- ✅ Basic ticker search and storage
- ✅ Daily and hourly price data collection
- ✅ Scheduled data gathering
- ✅ User authentication

### Phase 2: Enhanced Data Collection
- Real-time price streaming
- Additional data sources beyond AlphaVantage
- News and sentiment data integration
- Fundamental data (earnings, financials)

### Phase 3: Client Application
- Complete React UI implementation
- Interactive price charts and technical indicators
- User watchlists and portfolios
- Alerts and notifications

### Phase 4: Analytics & Intelligence
- Technical analysis calculations
- Price predictions using ML models
- Backtesting framework
- Performance analytics

### Phase 5: Production Ready
- Comprehensive test coverage
- CI/CD pipeline
- Production-grade monitoring
- High availability setup
- Performance optimization
