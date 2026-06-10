-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables (in correct dependency order)
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- 1. Create Profile Table
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    github_url VARCHAR(500) DEFAULT '',
    focus TEXT[] DEFAULT '{}',
    password VARCHAR(255),
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Skill Categories Table
CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(500) DEFAULT '',
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Skills Table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(500) DEFAULT '',
    category_uid UUID NOT NULL REFERENCES skill_categories(uid),
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) DEFAULT '',
    overview TEXT NOT NULL,
    architecture TEXT DEFAULT '',
    demo_url VARCHAR(500) DEFAULT '',
    source_url VARCHAR(500) DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    is_public BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Junction Table: Project <-> Skill
CREATE TABLE project_skills (
    id SERIAL PRIMARY KEY,
    project_uid UUID NOT NULL REFERENCES projects(uid),
    skill_uid UUID NOT NULL REFERENCES skills(uid),
    UNIQUE (project_uid, skill_uid)
);

-- =========================================================================
-- Seed Data
-- =========================================================================

-- Insert Profile (Password: admin123, hashed using bcrypt)
INSERT INTO profile (name, title, email, location, bio, github_url, focus, password)
VALUES (
    'John Doe', 
    'Software Engineer', 
    'john.doe@example.com', 
    'City, Country',
    'Passionate developer with experience in modern web technologies and building scalable applications.',
    'https://github.com/username', 
    ARRAY['fullstack', 'typescript', 'react'], 
    '$2b$10$EPY90GB1AqiJH5F5B/Y9V.dEw2z1v5/z1F1O8sI5y7vXn.d8o2x5G'
);

-- Insert Skill Categories
INSERT INTO skill_categories (name, icon) VALUES 
('frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
('backend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
('database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
('devops', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg');

-- Insert Skills (Linking to categories by name lookup)
INSERT INTO skills (name, icon, category_uid) VALUES 
('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', (SELECT uid FROM skill_categories WHERE name = 'frontend')),
('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', (SELECT uid FROM skill_categories WHERE name = 'frontend')),
('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', (SELECT uid FROM skill_categories WHERE name = 'frontend')),
('Vue.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', (SELECT uid FROM skill_categories WHERE name = 'frontend')),
('Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', (SELECT uid FROM skill_categories WHERE name = 'frontend')),
('Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', (SELECT uid FROM skill_categories WHERE name = 'backend')),
('Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', (SELECT uid FROM skill_categories WHERE name = 'backend')),
('Bun', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg', (SELECT uid FROM skill_categories WHERE name = 'backend')),
('Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', (SELECT uid FROM skill_categories WHERE name = 'backend')),
('PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', (SELECT uid FROM skill_categories WHERE name = 'database')),
('MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', (SELECT uid FROM skill_categories WHERE name = 'database')),
('Redis', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', (SELECT uid FROM skill_categories WHERE name = 'database')),
('Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', (SELECT uid FROM skill_categories WHERE name = 'devops')),
('Kubernetes', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg', (SELECT uid FROM skill_categories WHERE name = 'devops')),
('GitHub Actions', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg', (SELECT uid FROM skill_categories WHERE name = 'devops'));

-- Insert Projects
INSERT INTO projects (title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, is_deleted) VALUES 
('Express Bun TS Boilerplate', 'Production-ready REST API starter',
 'A comprehensive boilerplate for building REST APIs with Express.js, Bun runtime, and TypeScript. Features modular architecture, Swagger documentation, JWT authentication, Zod validation, and PostgreSQL integration. Designed for rapid API development with enterprise-grade patterns.',
 'Clean architecture with layered modules (Controller → Service → Repository → Database). Express 5 with Bun as runtime, PostgreSQL with pg driver, JWT auth with bcrypt, Zod for validation, Swagger/OpenAPI for docs, Morgan for logging, and CORS enabled.',
 'https://boilerplate.example.com', 'https://github.com/username/express-bun-ts-boilerplate',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', true, false),

('Microservices E-Commerce Platform', 'Scalable e-commerce with microservices',
 'Enterprise-grade e-commerce platform built with a microservices architecture. Includes product catalog, order management, payment processing, inventory tracking, and real-time notifications. Handles thousands of concurrent users with distributed tracing and event-driven communication.',
 'Microservices orchestrated with Kubernetes. API Gateway (Express/Bun) → Product Service, Order Service, Payment Service, Notification Service. PostgreSQL per service, Redis for caching, RabbitMQ for async messaging, Docker containers, CI/CD with GitHub Actions.',
 'https://ecommerce.example.com', 'https://github.com/username/microservices-ecommerce',
 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', true, false),

('Real-Time Analytics Dashboard', 'Live data visualization & monitoring',
 'Full-stack analytics dashboard providing real-time insights with WebSocket-powered live updates. Features interactive charts, custom metric tracking, user behavior analysis, exportable reports, and role-based access control. Optimized for large datasets with streaming data pipelines.',
 'Next.js 14 with App Router and server components for the frontend. Bun/Express backend with WebSocket (WS) for real-time pushes. TimescaleDB for time-series data, Redis Streams for data ingestion pipeline, Chart.js for visualizations, JWT + RBAC for auth.',
 'https://analytics.example.com', 'https://github.com/username/realtime-analytics-dashboard',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', true, false),

('DevOps CI/CD Pipeline Toolkit', 'Automated deployment & infrastructure as code',
 'Comprehensive DevOps toolkit featuring pre-built CI/CD pipeline templates, infrastructure-as-code modules, monitoring stack configurations, and automated security scanning. Supports multi-cloud deployments with zero-downtime rolling updates and automated rollback strategies.',
 'GitHub Actions + ArgoCD for GitOps deployment. Terraform for infrastructure provisioning on AWS/GCP. Docker containers orchestrated via Kubernetes (EKS/GKE). Prometheus + Grafana + Loki stack for observability. Trivy + SonarQube for security & quality gates.',
 '', 'https://github.com/username/devops-pipeline-toolkit',
 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800', true, false),

('TaskFlow - Project Management App', 'Collaborative kanban & agile project management',
 'Full-featured project management application with Kanban boards, sprint planning, time tracking, team collaboration, file sharing, and automated workflow triggers. Supports both Scrum and Kanban methodologies with customizable workflows and deep analytics.',
 'Vue 3 Composition API with Pinia state management and Vuetify components. Express/Bun API with Socket.IO for real-time collaboration. PostgreSQL with complex relational queries, Redis for pub/sub and caching. S3-compatible storage for file uploads, Docker Compose for local dev.',
 'https://taskflow.example.com', 'https://github.com/username/taskflow',
 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800', false, false);

-- Insert Project Skills
-- Project 1 (Express Bun TS Boilerplate)
INSERT INTO project_skills (project_uid, skill_uid) 
SELECT p.uid, s.uid FROM projects p, skills s 
WHERE p.title = 'Express Bun TS Boilerplate' 
AND s.name IN ('TypeScript', 'Node.js', 'Express', 'Bun', 'PostgreSQL', 'Docker');

-- Project 2 (Microservices E-Commerce Platform)
INSERT INTO project_skills (project_uid, skill_uid) 
SELECT p.uid, s.uid FROM projects p, skills s 
WHERE p.title = 'Microservices E-Commerce Platform' 
AND s.name IN ('TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'GitHub Actions', 'Python', 'React', 'Tailwind CSS');

-- Project 3 (Real-Time Analytics Dashboard)
INSERT INTO project_skills (project_uid, skill_uid) 
SELECT p.uid, s.uid FROM projects p, skills s 
WHERE p.title = 'Real-Time Analytics Dashboard' 
AND s.name IN ('TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'Bun', 'PostgreSQL', 'Redis', 'Docker');

-- Project 4 (DevOps CI/CD Pipeline Toolkit)
INSERT INTO project_skills (project_uid, skill_uid) 
SELECT p.uid, s.uid FROM projects p, skills s 
WHERE p.title = 'DevOps CI/CD Pipeline Toolkit' 
AND s.name IN ('Docker', 'Kubernetes', 'GitHub Actions', 'Python', 'TypeScript');

-- Project 5 (TaskFlow - Project Management App)
INSERT INTO project_skills (project_uid, skill_uid) 
SELECT p.uid, s.uid FROM projects p, skills s 
WHERE p.title = 'TaskFlow - Project Management App' 
AND s.name IN ('TypeScript', 'Vue.js', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions');
