# 🏋️ FitTrack — AI-Powered Fitness Microservices Platform

A full-stack fitness tracking platform built with a **Spring Cloud microservices architecture** and a **React** frontend. The application enables users to log workouts, receive **AI-generated fitness recommendations**, and analyze food nutrition from images — all secured with **Keycloak OAuth2** authentication.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables Setup](#-environment-variables-setup)
- [Installation Steps](#-installation-steps)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **User Authentication** — Secure login/signup via Keycloak OAuth2 with PKCE flow; automatic user sync on first login.
- **Activity Tracking** — Log workouts (Running, Cycling, Swimming, Yoga, HIIT, Weight Training, and more) with duration, calories, and custom metrics.
- **AI Fitness Coach** — Automatic AI-powered analysis of every logged activity, providing personalized performance analysis, improvement areas, workout suggestions, and safety tips.
- **Food Image Analysis** — Upload a photo of any meal and get instant AI-powered nutritional breakdown (calories, macros, health rating).
- **Dashboard & Statistics** — Visual overview with progress rings, bar/pie/area/line charts, and activity distribution.
- **Real-Time Event Processing** — Activities are published to RabbitMQ and asynchronously processed by the AI service.
- **Centralized Configuration** — All service configurations managed by Spring Cloud Config Server.
- **Service Discovery** — Eureka-based service registry with load-balanced inter-service communication.
- **API Gateway** — Single entry point with JWT validation, automatic Keycloak user sync, and CORS handling.

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Java 21 | Runtime |
| Spring Boot 4.0.x | Application framework |
| Spring Cloud Gateway | API gateway & routing |
| Spring Cloud Config | Centralized configuration |
| Spring Cloud Netflix Eureka | Service discovery |
| Spring Cloud LoadBalancer | Client-side load balancing |
| PostgreSQL | Relational database (User Service) |
| MongoDB Atlas | NoSQL database (Activity & AI Services) |
| RabbitMQ | Asynchronous message broker |
| Keycloak | OAuth2 / OpenID Connect identity provider |
| OpenRouter.ai | LLM API (Google Gemma, Qwen Vision) |
| Maven | Build & dependency management |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| React Router 7 | Client-side routing |
| Redux Toolkit | State management |
| Tailwind CSS 4 | Utility-first styling |
| Material-UI (MUI) | UI component library |
| Framer Motion | Animations & transitions |
| Axios | HTTP client |
| Recharts | Data visualization charts |
| react-oauth2-code-pkce | OAuth2 PKCE authentication |

---

## 🏗 Architecture

```
┌─────────────┐         ┌──────────────┐
│   React UI  │◄───────►│   Keycloak   │
│  (Port 5173)│  OAuth2  │  (Port 8181) │
└──────┬──────┘  PKCE   └──────────────┘
       │
       │ Bearer JWT
       ▼
┌──────────────────────────────────────────────┐
│            API Gateway (Port 8080)           │
│  • JWT Validation  • User Sync  • CORS      │
│  • Route: /api/users/**     → User Service   │
│  • Route: /api/activities/** → Activity Svc  │
│  • Route: /api/recommendation/** → AI Svc   │
│  • Route: /api/ai/**        → AI Service     │
└──────┬────────────┬────────────┬─────────────┘
       │            │            │
       ▼            ▼            ▼
┌────────────┐┌────────────┐┌────────────┐
│   User     ││  Activity  ││    AI      │
│  Service   ││  Service   ││  Service   │
│ (Port 8081)││ (Port 8082)││ (Port 8083)│
│ PostgreSQL ││  MongoDB   ││  MongoDB   │
└────────────┘└─────┬──────┘└─────▲──────┘
                    │             │
                    │  RabbitMQ   │
                    └─────────────┘
                   (activity.queue)

         ┌──────────────────────┐
         │  Eureka Server       │
         │  (Port 8761)         │
         │  Service Discovery   │
         └──────────────────────┘

         ┌──────────────────────┐
         │  Config Server       │
         │  (Port 8333)         │
         │  Centralized Config  │
         └──────────────────────┘
```

### Data Flow: Activity → AI Recommendation

1. User logs an activity from the frontend.
2. Request goes through the API Gateway (JWT validated, `X-User-ID` header injected).
3. Activity Service validates the user via User Service, saves to MongoDB, and publishes the activity to RabbitMQ.
4. AI Service consumes the message, calls the OpenRouter.ai LLM API with a structured prompt, and saves the recommendation to MongoDB.
5. Frontend fetches the recommendation for display.

---

## 📁 Project Structure

```
fitness-microservices/
│
├── configserver/              # Spring Cloud Config Server (Port 8333)
│   └── src/main/resources/
│       └── config/
│           ├── user-service.yml
│           ├── activity-service.yml
│           ├── ai-service.yml
│           └── api-gateway.yaml
│
├── eureka/                    # Eureka Service Discovery (Port 8761)
│
├── gateway/                   # API Gateway (Port 8080)
│   └── src/main/java/.../
│       ├── SecurityConfig.java
│       ├── keycloakUserSyncFilter.java
│       └── UserService.java
│
├── userservice/               # User Management Service (Port 8081)
│   └── src/main/java/.../
│       ├── controller/UserController.java
│       ├── service/UserService.java
│       ├── model/User.java
│       ├── repository/UserRepository.java
│       └── dto/
│
├── activiyservice/            # Activity Tracking Service (Port 8082)
│   └── src/main/java/.../
│       ├── controller/ActivityController.java
│       ├── service/ActivityService.java
│       ├── model/Activity.java
│       ├── config/RabbitMqConfig.java
│       └── dto/
│
├── aiservice/                 # AI Recommendation Service (Port 8083)
│   └── src/main/java/.../
│       ├── controller/
│       │   ├── RecommendationController.java
│       │   └── FoodAnalysisController.java
│       ├── service/
│       │   ├── GeminiService.java
│       │   ├── ActivityAIService.java
│       │   ├── FoodAnalysisService.java
│       │   └── ActivityMessageListener.java
│       ├── model/Recommendation.java
│       └── dto/
│
├── fitness-app-frontend/      # React Frontend (Port 5173)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── authConfig.js
│   │   ├── services/api.js
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── authSlice.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ActivityTracker.jsx
│   │   │   ├── ActivityDetail.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── AISuggestions.jsx
│   │   │   ├── FoodAnalyzer.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   └── PageWrapper.jsx
│   │   └── utils/
│   │       ├── activityHelpers.js
│   │       └── animations.js
│   ├── package.json
│   └── vite.config.js
│
├── start-all-services.ps1     # Launch all services (Windows)
├── stop-all-services.ps1      # Stop all services (Windows)
└── README.md
```

---

## 📌 Prerequisites

Ensure the following are installed and running before starting the application:

| Dependency | Version | Notes |
|---|---|---|
| **Java JDK** | 21+ | Required for all backend services |
| **Maven** | 3.9+ | Build tool (or use the included `mvnw` wrapper) |
| **Node.js** | 18+ | Required for the React frontend |
| **npm** | 9+ | Comes with Node.js |
| **PostgreSQL** | 15+ | Database for User Service |
| **RabbitMQ** | 3.12+ | Message broker (with management plugin) |
| **Keycloak** | 24+ | OAuth2 identity provider |
| **MongoDB Atlas** | — | Cloud-hosted (or local MongoDB 7+) |

---

## 🔐 Environment Variables Setup

### Keycloak Configuration

1. Run Keycloak on port **8181**.
2. Create a realm named **`fitness-oauth2`**.
3. Create a public client named **`oauth2-pkce-client`** with:
   - **Valid Redirect URIs:** `http://localhost:5173/*`
   - **Web Origins:** `http://localhost:5173`
   - **Standard Flow Enabled:** ON
   - **PKCE:** S256

### PostgreSQL

Create the database for the User Service:

```sql
CREATE DATABASE fitness_user_db;
```

### Config Server Properties

Update credentials in `configserver/src/main/resources/config/`:

| File | Property | Description |
|---|---|---|
| `user-service.yml` | `spring.datasource.url` | PostgreSQL connection URL |
| `user-service.yml` | `spring.datasource.username` | PostgreSQL username |
| `user-service.yml` | `spring.datasource.password` | PostgreSQL password |
| `activity-service.yml` | `spring.data.mongodb.uri` | MongoDB Atlas connection string |
| `ai-service.yml` | `spring.data.mongodb.uri` | MongoDB Atlas connection string |
| `ai-service.yml` | `gemini.api.key` | OpenRouter.ai API key |
| `ai-service.yml` | `gemini.api.model` | LLM model for text analysis |
| `ai-service.yml` | `gemini.api.vision-model` | Vision model for food analysis |
| `api-gateway.yaml` | `spring.security.oauth2.resourceserver.jwt.jwk-set-uri` | Keycloak JWKS endpoint |

### Frontend Environment (Optional)

Create `fitness-app-frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fitness-microservices
```

### 2. Build All Backend Services

```bash
# Config Server
cd configserver && ./mvnw clean package -DskipTests && cd ..

# Eureka Server
cd eureka && ./mvnw clean package -DskipTests && cd ..

# User Service
cd userservice && ./mvnw clean package -DskipTests && cd ..

# Activity Service
cd activiyservice && ./mvnw clean package -DskipTests && cd ..

# AI Service
cd aiservice && ./mvnw clean package -DskipTests && cd ..

# API Gateway
cd gateway && ./mvnw clean package -DskipTests && cd ..
```

### 3. Install Frontend Dependencies

```bash
cd fitness-app-frontend
npm install
cd ..
```

---

## ▶️ Running the Application

### Option A: Automated Startup (Windows PowerShell)

```powershell
.\start-all-services.ps1
```

This script starts all services in the correct order with appropriate wait times:

1. Config Server (8333) → waits 8s
2. Eureka Server (8761) → waits 10s
3. User Service (8081) → waits 5s
4. Activity Service (8082) → waits 5s
5. AI Service (8083) → waits 5s
6. API Gateway (8080)

To stop all services:

```powershell
.\stop-all-services.ps1
```

### Option B: Manual Startup

Start each service **in order** in separate terminals:

```bash
# Terminal 1 — Config Server (start first, wait until ready)
cd configserver && ./mvnw spring-boot:run

# Terminal 2 — Eureka Server (wait until ready)
cd eureka && ./mvnw spring-boot:run

# Terminal 3 — User Service
cd userservice && ./mvnw spring-boot:run

# Terminal 4 — Activity Service
cd activiyservice && ./mvnw spring-boot:run

# Terminal 5 — AI Service
cd aiservice && ./mvnw spring-boot:run

# Terminal 6 — API Gateway (start last)
cd gateway && ./mvnw spring-boot:run
```

### Start the Frontend

```bash
cd fitness-app-frontend
npm run dev
```

### Access Points

| Service | URL |
|---|---|
| **Frontend** | http://localhost:5173 |
| **API Gateway** | http://localhost:8080 |
| **Eureka Dashboard** | http://localhost:8761 |
| **Config Server** | http://localhost:8333 |
| **Keycloak Admin** | http://localhost:8181 |
| **RabbitMQ Management** | http://localhost:15672 |

---

## 📡 API Endpoints

All API requests go through the **API Gateway** at `http://localhost:8080`. Authenticated requests require a `Bearer` token in the `Authorization` header.

### User Service — `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Register a new user |
| `GET` | `/api/users/{userId}` | Get user profile by ID |
| `GET` | `/api/users/{userId}/validate` | Validate user exists by ID |
| `GET` | `/api/users/by-keycloak/{keycloakId}/validate` | Validate user by Keycloak ID |

### Activity Service — `/api/activities`

| Method | Endpoint | Headers | Description |
|---|---|---|---|
| `POST` | `/api/activities` | `X-User-ID` | Log a new activity |
| `GET` | `/api/activities` | `X-User-ID` | Get all activities for user |
| `GET` | `/api/activities/{activityId}` | — | Get activity by ID |

**Activity Types:** `RUNNING`, `WALKING`, `CYCLING`, `SWIMMING`, `WEIGHT_TRAINING`, `YOGA`, `HIIT`, `CARDIO`, `STRETCHING`, `OTHER`

#### Sample Request — Log an Activity

```json
POST /api/activities
Content-Type: application/json
Authorization: Bearer <token>
X-User-ID: <keycloak-sub>

{
  "type": "RUNNING",
  "duration": 45,
  "caloriesBurned": 520,
  "startTime": "2026-03-06T07:30:00",
  "additionalMetrics": {
    "distance_km": 6.2,
    "avg_heart_rate": 155
  }
}
```

### AI / Recommendation Service — `/api/recommendation` & `/api/ai`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recommendation/user/{userId}` | Get all recommendations for a user |
| `GET` | `/api/recommendation/activity/{activityId}` | Get recommendation for a specific activity |
| `POST` | `/api/ai/analyze-food-image` | Analyze a food image (multipart form) |

#### Sample Request — Food Image Analysis

```bash
curl -X POST http://localhost:8080/api/ai/analyze-food-image \
  -H "Authorization: Bearer <token>" \
  -F "image=@meal.jpg"
```

#### Sample Response — Food Analysis

```json
{
  "foodName": "Grilled Chicken Salad",
  "ingredients": ["chicken breast", "lettuce", "tomato", "olive oil"],
  "calories": 380,
  "protein": "35g",
  "carbohydrates": "12g",
  "fat": "18g",
  "fiber": "4g",
  "sugar": "3g",
  "healthRating": "Healthy",
  "explanation": "A well-balanced, high-protein meal ideal for post-workout recovery."
}
```

---

## 📸 Screenshots

> _Add screenshots of the application here._

| Page | Screenshot |
|---|---|
| Landing Page | ![Landing Page](screenshots/landing.png) |
| Dashboard | ![Dashboard](screenshots/dashboard.png) |
| Activity Tracker | ![Activity Tracker](screenshots/activity-tracker.png) |
| Activity Detail & AI Recommendation | ![Activity Detail](screenshots/activity-detail.png) |
| Statistics | ![Statistics](screenshots/statistics.png) |
| AI Suggestions | ![AI Suggestions](screenshots/ai-suggestions.png) |
| Food Analyzer | ![Food Analyzer](screenshots/food-analyzer.png) |
| Profile | ![Profile](screenshots/profile.png) |

---

## 🔮 Future Improvements

- **Docker Compose** — Containerize all services for one-command deployment.
- **CI/CD Pipeline** — Automated build, test, and deployment with GitHub Actions.
- **Social Features** — Workout sharing, leaderboards, and community challenges.
- **Workout Plans** — AI-generated weekly/monthly training programs.
- **Wearable Integration** — Sync data from Fitbit, Garmin, Apple Watch.
- **Push Notifications** — Reminders for workouts and goal tracking.
- **Meal Planning** — AI-based meal suggestions based on fitness goals and food analysis history.
- **Circuit Breaker** — Add Resilience4j for fault tolerance across services.
- **Distributed Tracing** — Integrate Zipkin/Jaeger for request tracing.
- **Caching** — Add Redis for improved performance on frequently accessed data.
- **Rate Limiting** — Protect API Gateway endpoints from abuse.
- **Unit & Integration Tests** — Expand test coverage across all services.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository.
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request with a clear description.

### Guidelines

- Follow existing code style and project conventions.
- Write meaningful commit messages.
- Update documentation if your changes affect the setup or API.
- Test your changes locally before submitting.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Spring Cloud, React & AI
</p>
