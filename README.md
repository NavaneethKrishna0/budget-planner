# 💰 Full-Stack Budget Planner

![CI/CD Pipeline](https://github.com/NavaneethKrishna0/budget-planner/actions/workflows/ci-cd.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, full-stack budget management application built with React, Spring Boot, and MySQL. This project allows users to track their income, manage expenses, set savings goals, and visualize their financial habits through an interactive and responsive web interface.

The entire application is fully containerized with Docker and features a complete CI/CD pipeline using GitHub Actions for automated building, testing, and deployment to an AWS EC2 instance.

**Live Demo URL:** `http://3.88.103.218:3000/`

---

## ✨ Features

* **📊 Interactive Dashboard:** A main hub to visualize income vs. expenses, current balance, and recent activity.
* **💸 Transaction Tracking:** Easily add, view, and categorize all income and expense transactions.
* **🎯 Savings Goals:** Create and manage financial goals, with visual progress bars to track your savings.
* **📈 Detailed Reports:** Analyze your spending habits with a filterable bar chart showing spending by category.
* **🐳 Fully Containerized:** The entire stack (Frontend, Backend, DB) runs in isolated Docker containers.
* **🚀 Automated Deployment:** Every push to the `main` branch automatically builds, tests, and deploys the latest version to the live server.

---

## 📸 Screenshots

*(Add screenshots of your application here)*

| Dashboard | Transactions Page |
| :---: | :---: |
| \

[Image of Dashboard]
 | \ |

| Reports Page | Goals Page |
| :---: | :---: |
| \ | \

[Image of Goals Page]
 |

---

## 🛠️ Tech Stack & Architecture

This project uses a modern, decoupled three-tier architecture.

| Tier | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js | A responsive user interface built with React, Chart.js, and Axios. |
| **Backend** | Spring Boot | A robust REST API built with Java, Spring Web, and Spring Data JPA. |
| **Database** | MySQL | A relational database for all persistent data. |
| **DevOps** | Docker & Docker Compose | For containerizing and orchestrating the full application stack. |
| **CI/CD** | GitHub Actions | Automated pipeline for building, pushing to Docker Hub, and deploying. |
| **Cloud** | AWS EC2 | The virtual private server hosting the live application. |

---

## 🚀 Getting Started (Local Deployment)

You can run the entire application on your local machine using Docker Desktop.

### Prerequisites

* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/NavaneethKrishna0/budget-planner.git](https://github.com/NavaneethKrishna0/budget-planner.git)
    cd budget-planner
    ```

2.  **Set Up Environment Variables:**
    In the root `docker-compose.yml` file, make sure to set your desired passwords for the database:
    ```yml
    services:
      db:
        environment:
          MYSQL_ROOT_PASSWORD: <your_root_password>
          MYSQL_USER: <your_user>
          MYSQL_PASSWORD: <your_password>
      backend:
        environment:
          SPRING_DATASOURCE_USERNAME: <your_user>
          SPRING_DATASOURCE_PASSWORD: <your_password>
    ```
    *Make sure the `backend` credentials **exactly match** the `db` credentials.*

3.  **Build and Run the Containers:**
    Run the following command from the root of the project:
    ```sh
    docker-compose up --build
    ```

4.  **Access the Application:**
    * **Frontend:** `http://localhost:3000`
    * **Backend API:** `http://localhost:8081`

---

## ⚙️ CI/CD Pipeline

This project is configured with a complete CI/CD pipeline using GitHub Actions (`.github/workflows/ci-cd.yml`). The workflow is triggered on every push to the `main` branch and performs the following jobs:

1.  **`build-and-push`:**
    * Sets up Java 21.
    * Builds the Spring Boot application into a `.jar` file (skipping tests).
    * Logs in to Docker Hub.
    * Builds and pushes the `backend` Docker image to Docker Hub.
    * Builds and pushes the `frontend` Docker image to Docker Hub.

2.  **`deploy`:**
    * Waits for the `build-and-push` job to succeed.
    * Connects to the AWS EC2 server via SSH.
    * Navigates to the project directory.
    * Pulls the latest code from GitHub (`git pull`).
    * Pulls the new images from Docker Hub (`docker-compose pull`).
    * Stops and removes the old containers (`docker-compose down`).
    * Starts the new, updated containers (`docker-compose up -d`).

---

## 📄 License

This project is licensed under the MIT License.
