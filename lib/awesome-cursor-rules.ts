// Service for integrating with awesome-cursor-rules repository
import { PromptRule, CreatePromptRule } from './models'

export interface AwesomeCursorRule {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  language?: string
  framework?: string
  popularity?: number
  source: 'awesome-cursor-rules'
}

export class AwesomeCursorRulesService {
  private readonly GITHUB_API_BASE = 'https://api.github.com'
  private readonly AWESOME_CURSOR_REPO = 'PatrickJS/awesome-cursorrules'
  
  // Fetch popular cursor rules from the awesome-cursorrules repository
  async fetchPopularRules(): Promise<AwesomeCursorRule[]> {
    try {
      // Note: This would typically fetch from the actual GitHub repository
      // For now, we'll return a curated list of popular rules
      return this.getPopularCursorRules()
    } catch (error) {
      console.error('Error fetching awesome cursor rules:', error)
      throw error
    }
  }

  // Get popular cursor rules (hardcoded for now, would be dynamic in real implementation)
  private getPopularCursorRules(): AwesomeCursorRule[] {
    return [
      {
        title: "React TypeScript Best Practices",
        description: "Comprehensive React TypeScript development rules for modern applications",
        category: "frontend",
        tags: ["react", "typescript", "frontend", "components"],
        language: "typescript",
        framework: "react",
        popularity: 95,
        source: "awesome-cursor-rules",
        content: `You are an expert in TypeScript, Node.js, Next.js 14, React, Zustand, TailwindCSS, Radix UI and modern web development.

Code Style and Structure
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

Naming Conventions
- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps or objects with 'as const' assertion.
- Use functional components with TypeScript interfaces.

Syntax and Formatting
- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

UI and Styling
- Use Headless UI, Radix, or Shadcn/UI for components.
- Use TailwindCSS for styling.
- Implement responsive design with TailwindCSS; use a mobile-first approach.

Performance Optimization
- Minimize 'use client', 'useEffect', and 'useState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

Key Conventions
- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web APIs, event handlers, state, effects, browser-only libraries.
  - Use Zustand for client state management.
  - Minimize scope: push 'use client' down to leaf components, wrap client components in Suspense.

Follow Next.js docs for Data Fetching, Rendering, and Routing.`
      },
      {
        title: "Python Backend Development",
        description: "Python backend development with FastAPI, SQLAlchemy, and best practices",
        category: "backend",
        tags: ["python", "fastapi", "backend", "api"],
        language: "python",
        framework: "fastapi",
        popularity: 88,
        source: "awesome-cursor-rules",
        content: `You are an expert in Python, FastAPI, and scalable API development.

Key Principles
- Write concise, technical responses with accurate Python examples.
- Use functional programming; avoid classes where simple functions suffice.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., is_active, has_permission).
- Use lowercase with underscores for directories and file names (e.g., routers/user_routes.py).
- Favor named exports and avoid default exports.

FastAPI
- Use FastAPI for building APIs with automatic interactive documentation.
- Use Pydantic models for request/response schemas and data validation.
- Use dependency injection for shared logic, security, and database sessions.
- Use async/await for I/O operations; use sync functions for CPU-intensive tasks.
- Use middleware for cross-cutting concerns like logging, rate limiting, and CORS.

Database
- Use SQLAlchemy 2.0+ with asyncio for database operations.
- Use Alembic for database migrations.
- Use async database drivers like asyncpg for PostgreSQL.

Error Handling
- Use custom exception handlers for consistent error responses.
- Use HTTPException for expected errors with appropriate status codes.
- Log unexpected errors for debugging and monitoring.

Testing
- Use pytest for testing with async support.
- Use pytest-asyncio for testing async functions.
- Use httpx for testing FastAPI applications.
- Use factories or fixtures for test data generation.

Performance
- Use async functions for I/O operations (database, HTTP requests).
- Use connection pooling for database connections.
- Use caching strategies (Redis, in-memory) for frequently accessed data.
- Use background tasks for non-blocking operations.

Security
- Use environment variables for sensitive configuration.
- Use OAuth2 with JWT tokens for authentication.
- Use dependency injection for security dependencies.
- Validate and sanitize all input data using Pydantic.

Key Conventions
- Structure project: app/routers/, app/models/, app/schemas/, app/core/
- Use absolute imports from app directory.
- Use Pydantic BaseModel for schemas with proper validation.
- Use SQLAlchemy declarative models with proper relationships.
- Use dependency injection for database sessions, authentication, etc.

Follow the FastAPI documentation for building robust, scalable APIs.`
      },
      {
        title: "Node.js Express API Development",
        description: "Modern Node.js API development with Express, TypeScript, and security best practices",
        category: "backend",
        tags: ["nodejs", "express", "api", "typescript"],
        language: "typescript",
        framework: "express",
        popularity: 82,
        source: "awesome-cursor-rules",
        content: `You are an expert in Node.js, Express.js, TypeScript, and backend API development.

Code Style and Structure
- Write clean, readable TypeScript code with proper type annotations.
- Use async/await for asynchronous operations instead of callbacks.
- Implement proper error handling with custom error classes.
- Use middleware pattern for cross-cutting concerns.
- Follow RESTful API design principles.

Project Structure
- Organize code: src/controllers/, src/models/, src/middleware/, src/routes/
- Use barrel exports (index.ts) for clean imports.
- Separate concerns: routes, controllers, services, models.
- Use dependency injection for better testability.

TypeScript Best Practices
- Use strict TypeScript configuration.
- Define interfaces for all data structures.
- Use generic types for reusable functions.
- Avoid 'any' type; use 'unknown' when type is uncertain.

Express.js Patterns
- Use express.Router() for modular route definitions.
- Implement proper middleware stack: logging, CORS, body parsing, error handling.
- Use helmet for security headers.
- Implement rate limiting and request validation.

Database Integration
- Use TypeORM or Prisma for database operations.
- Implement proper connection pooling.
- Use transactions for data consistency.
- Add database migrations and seeders.

Error Handling
- Create custom error classes extending Error.
- Use centralized error handling middleware.
- Return consistent error response format.
- Log errors with appropriate levels.

Security Best Practices
- Use environment variables for configuration.
- Implement JWT authentication with refresh tokens.
- Validate and sanitize all inputs.
- Use HTTPS in production.
- Implement proper CORS policies.

Testing
- Use Jest for unit and integration testing.
- Use supertest for API endpoint testing.
- Mock external dependencies.
- Maintain high test coverage.

Performance Optimization
- Use compression middleware.
- Implement caching strategies (Redis).
- Use connection pooling for databases.
- Monitor performance with APM tools.

Key Conventions
- Use camelCase for JavaScript/TypeScript.
- Use HTTP status codes appropriately.
- Implement proper logging with Winston or similar.
- Use PM2 for process management in production.
- Follow semantic versioning for API versions.`
      },
      {
        title: "Vue.js 3 Composition API",
        description: "Modern Vue.js 3 development with Composition API, TypeScript, and Pinia",
        category: "frontend",
        tags: ["vue", "typescript", "frontend", "composition-api"],
        language: "typescript",
        framework: "vue",
        popularity: 79,
        source: "awesome-cursor-rules",
        content: `You are an expert in Vue.js 3, TypeScript, and modern frontend development.

Code Style and Structure
- Use Vue 3 Composition API with <script setup> syntax.
- Write TypeScript for all components and composables.
- Use Pinia for state management.
- Prefer composition functions over mixins.
- Use single-file components (.vue) with clear separation of concerns.

Vue 3 Best Practices
- Use ref() for primitive reactive data.
- Use reactive() for objects and arrays.
- Use computed() for derived state.
- Use watch() and watchEffect() for side effects.
- Destructure props and emit for better readability.

TypeScript Integration
- Define props using defineProps<T>() with interface.
- Use defineEmits<T>() for type-safe event emitting.
- Create composables with proper return type annotations.
- Use generic components when appropriate.

Component Patterns
- Keep components small and focused on single responsibility.
- Use provide/inject for dependency injection.
- Implement proper component communication patterns.
- Use slots for flexible component composition.

State Management with Pinia
- Define stores using defineStore() with setup syntax.
- Use getters for computed state.
- Keep actions async when dealing with API calls.
- Use store composition for complex state logic.

Styling and UI
- Use CSS Modules or <style scoped> for component styling.
- Implement responsive design with CSS Grid/Flexbox.
- Use CSS custom properties for theming.
- Consider using Headless UI or PrimeVue for components.

Performance Optimization
- Use defineAsyncComponent() for code splitting.
- Implement proper key attributes for v-for loops.
- Use v-memo for expensive list rendering.
- Optimize bundle size with tree shaking.

Testing
- Use Vitest for unit testing Vue components.
- Use Vue Test Utils for component testing.
- Mock Pinia stores in tests.
- Test user interactions and component behavior.

Key Conventions
- Use PascalCase for component names.
- Use camelCase for props and methods.
- Use kebab-case for custom events.
- Follow Vue.js style guide recommendations.
- Use TypeScript strict mode for better type safety.

Development Tools
- Use Vite for fast development and building.
- Use Vue DevTools for debugging.
- Implement proper ESLint and Prettier configuration.
- Use Husky for git hooks and quality gates.`
      },
      {
        title: "DevOps and Infrastructure",
        description: "Modern DevOps practices with Docker, Kubernetes, and CI/CD pipelines",
        category: "devops",
        tags: ["docker", "kubernetes", "cicd", "infrastructure"],
        language: "yaml",
        framework: "kubernetes",
        popularity: 75,
        source: "awesome-cursor-rules",
        content: `You are an expert in DevOps, containerization, orchestration, and cloud infrastructure.

Containerization with Docker
- Write efficient Dockerfiles with multi-stage builds.
- Use specific base image versions, not 'latest'.
- Minimize image layers and size.
- Use .dockerignore to exclude unnecessary files.
- Run containers as non-root users for security.

Kubernetes Best Practices
- Use namespaces for environment separation.
- Define resource requests and limits for all containers.
- Use ConfigMaps and Secrets for configuration management.
- Implement health checks with liveness and readiness probes.
- Use Helm charts for application packaging and deployment.

CI/CD Pipeline Design
- Implement automated testing at multiple stages.
- Use branch protection rules and required status checks.
- Implement automated security scanning in pipelines.
- Use blue-green or rolling deployments for zero downtime.
- Store secrets securely using CI/CD secret management.

Infrastructure as Code
- Use Terraform for infrastructure provisioning.
- Version control all infrastructure code.
- Use modules for reusable infrastructure components.
- Implement proper state management and locking.
- Use workspace separation for different environments.

Monitoring and Observability
- Implement structured logging with correlation IDs.
- Use Prometheus and Grafana for metrics and visualization.
- Set up alerting for critical system metrics.
- Implement distributed tracing for microservices.
- Use log aggregation tools like ELK stack or Loki.

Security Best Practices
- Scan container images for vulnerabilities.
- Use network policies for micro-segmentation.
- Implement RBAC for proper access control.
- Use secrets management tools (HashiCorp Vault, etc.).
- Regular security audits and penetration testing.

Cloud Platform Integration
- Use managed services when appropriate.
- Implement auto-scaling based on metrics.
- Use cloud-native storage solutions.
- Implement proper backup and disaster recovery.
- Optimize costs with right-sizing and scheduling.

Key Conventions
- Use semantic versioning for all deployments.
- Tag all resources appropriately for cost tracking.
- Document all infrastructure decisions and runbooks.
- Use GitOps for deployment management.
- Implement proper environment promotion workflows.

Tools and Technologies
- Git for version control with proper branching strategies.
- Jenkins, GitLab CI, or GitHub Actions for CI/CD.
- Kubernetes for container orchestration.
- Helm for package management.
- Terraform for infrastructure as code.`
      }
    ]
  }

  // Convert awesome cursor rule to internal prompt rule format
  convertToPromptRule(awesomeRule: AwesomeCursorRule): CreatePromptRule {
    return {
      title: awesomeRule.title,
      content: awesomeRule.content,
      category: awesomeRule.category,
      createdBy: 'awesome-cursor-rules',
      source: 'awesome-cursor-rules',
      tags: awesomeRule.tags
    }
  }

  // Get rules filtered by technology stack
  async getRulesByStack(stack: string[]): Promise<AwesomeCursorRule[]> {
    const allRules = await this.fetchPopularRules()
    
    return allRules.filter(rule => 
      stack.some(tech => 
        rule.tags.some(tag => 
          tag.toLowerCase().includes(tech.toLowerCase())
        ) ||
        rule.language?.toLowerCase().includes(tech.toLowerCase()) ||
        rule.framework?.toLowerCase().includes(tech.toLowerCase())
      )
    ).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  }

  // Get rules by category with popularity ranking
  async getRulesByCategory(category: string): Promise<AwesomeCursorRule[]> {
    const allRules = await this.fetchPopularRules()
    
    return allRules
      .filter(rule => rule.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  }

  // Get top trending rules based on popularity
  async getTrendingRules(limit: number = 10): Promise<AwesomeCursorRule[]> {
    const allRules = await this.fetchPopularRules()
    
    return allRules
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit)
  }

  // Search rules by technology or keyword
  async searchRules(query: string): Promise<AwesomeCursorRule[]> {
    const allRules = await this.fetchPopularRules()
    const searchTerm = query.toLowerCase()
    
    return allRules.filter(rule =>
      rule.title.toLowerCase().includes(searchTerm) ||
      rule.description.toLowerCase().includes(searchTerm) ||
      rule.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      rule.language?.toLowerCase().includes(searchTerm) ||
      rule.framework?.toLowerCase().includes(searchTerm)
    ).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  }
}

// Export singleton instance
export const awesomeCursorRulesService = new AwesomeCursorRulesService()

// Popular technology stacks for easy reference
export const POPULAR_TECH_STACKS = {
  FRONTEND: ['react', 'vue', 'angular', 'typescript', 'javascript'],
  BACKEND: ['nodejs', 'python', 'java', 'go', 'rust', 'php'],
  MOBILE: ['react-native', 'flutter', 'swift', 'kotlin', 'ionic'],
  DEVOPS: ['docker', 'kubernetes', 'terraform', 'aws', 'azure'],
  DATABASE: ['postgresql', 'mongodb', 'redis', 'mysql', 'elasticsearch'],
  AI_ML: ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'openai']
} as const