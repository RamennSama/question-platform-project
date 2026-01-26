# Spring Boot Question & Blog Platform

A full-stack web application for creating, sharing, and discussing technical questions and blog posts. Built with Spring Boot backend and React frontend, featuring JWT authentication, role-based access control, and real-time interactions.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (USER, ADMIN)
  - Secure password encryption with BCrypt
  - Token-based session management

- **Post Management**
  - Create, read, update, and delete posts
  - Rich text editor support (React Quill)
  - Post approval workflow for admins
  - Tag-based categorization
  - Post slugs for SEO-friendly URLs
  - Like/Dislike functionality

- **Comment System**
  - Nested commenting on posts
  - Real-time comment interactions
  - User engagement tracking

- **User Profiles**
  - Public user profiles
  - Personal dashboard
  - User post history
  - Profile management

- **Tag System**
  - Organize posts by topics
  - Browse posts by tags
  - Tag creation and management

- **Admin Dashboard**
  - User management
  - Content moderation
  - Post approval system
  - Platform statistics

### Technical Features
- RESTful API architecture
- WebSocket support for real-time features
- CORS configuration for frontend-backend communication
- Swagger/OpenAPI documentation
- MySQL database integration
- JPA/Hibernate ORM
- Responsive React UI

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 4.0.1
- **Language:** Java 21
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security + JWT (jjwt 0.11.5)
- **Documentation:** SpringDoc OpenAPI 2.8.9
- **Build Tool:** Maven
- **Additional Libraries:**
  - Lombok (code generation)
  - Spring Boot DevTools
  - Bean Validation

### Frontend
- **Framework:** React 18.2.0
- **Routing:** React Router DOM 6.30.3
- **HTTP Client:** Axios 1.13.2
- **Rich Text Editor:** React Quill 2.0.0
- **Icons:** Lucide React 0.563.0
- **Testing:** React Testing Library, Jest

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+ and npm
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd spring-boot-question-platform
```

### 2. Database Configuration

Create a MySQL database:
```sql
CREATE DATABASE myblog;
CREATE USER 'csdl_longsama'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON myblog.* TO 'csdl_longsama'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup

Update `src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/myblog
spring.datasource.username=csdl_longsama
spring.datasource.password=12345
spring.jwt.secret=YzJ2bnhnaW5sb2NhbHNlY3JldGtleTEyMzQ1Njc4OTA=
spring.jwt.expiration=900000
```

Build and run the backend:
```bash
mvnw clean install
mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📚 API Documentation

Once the application is running, access the Swagger UI documentation at:
```
http://localhost:8080/docs
```

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

#### Posts
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/{slug}` - Get post by slug
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{slug}/like` - Like a post
- `POST /api/posts/{slug}/dislike` - Dislike a post
- `GET /api/posts/user/{userId}` - Get posts by user

#### Comments
- `POST /api/comments` - Add comment to post
- `GET /api/comments/post/{postId}` - Get comments for a post

#### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag (authenticated)

#### Users
- `GET /api/users/info` - Get current user info
- `GET /api/users/{userId}` - Get public user profile

#### Admin
- `GET /api/admin/**` - Admin-only endpoints
- `PUT /api/posts/*/approve` - Approve posts

## 🏗️ Project Structure

```
spring-boot-question-platform/
├── src/main/java/com/ramennsama/springboot/blogproject/
│   ├── buildblog.java              # Main application class
│   ├── config/                     # Configuration classes
│   │   ├── CorsConfig.java         # CORS configuration
│   │   ├── JwtAuthFilter.java      # JWT authentication filter
│   │   ├── SecurityConfig.java     # Security configuration
│   │   └── SwaggerConfig.java      # API documentation config
│   ├── controller/                 # REST controllers
│   │   ├── AuthController.java     # Authentication endpoints
│   │   ├── PostController.java     # Post management
│   │   ├── CommentController.java  # Comment management
│   │   ├── TagController.java      # Tag management
│   │   ├── UserController.java     # User management
│   │   └── AdminController.java    # Admin operations
│   ├── entity/                     # JPA entities
│   │   ├── User.java               # User entity
│   │   ├── Post.java               # Post entity
│   │   ├── Comment.java            # Comment entity
│   │   ├── Tag.java                # Tag entity
│   │   └── Authority.java          # Role/Authority entity
│   ├── repository/                 # Spring Data repositories
│   ├── service/                    # Business logic services
│   ├── dto/                        # Data Transfer Objects
│   ├── exception/                  # Custom exceptions
│   └── utils/                      # Utility classes
├── src/main/resources/
│   ├── application.properties      # Application configuration
│   └── static/                     # Static resources
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   └── Navbar.js           # Navigation bar
│   │   ├── contexts/               # React contexts
│   │   │   └── AuthContext.js      # Authentication context
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── Questions.js        # Questions list
│   │   │   ├── PostDetail.js       # Individual post view
│   │   │   ├── CreatePost.js       # Post creation form
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Dashboard.js        # User dashboard
│   │   │   ├── MyPosts.js          # User's posts
│   │   │   ├── Profile.js          # User profile
│   │   │   └── Tags.js             # Tags browsing
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   └── App.js                  # Main app component
│   └── package.json
└── pom.xml                         # Maven configuration
```

## 🔐 Security Features

- **JWT Authentication:** Stateless authentication using JSON Web Tokens
- **Password Encryption:** BCrypt password hashing
- **CORS Protection:** Configured CORS policy for API security
- **Role-Based Authorization:** USER and ADMIN roles with different permissions
- **Protected Routes:** Frontend route guards for authenticated access
- **SQL Injection Prevention:** JPA/Hibernate parameterized queries

## 🧪 Testing

Run backend tests:
```bash
mvnw test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
```bash
mvnw clean package
```

2. Run the JAR:
```bash
java -jar target/WebSockets2-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Serve the `build` folder using any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Ramennsama**

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- All contributors and supporters of this project

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Note:** Remember to change default credentials and JWT secret in production environments for security purposes.
