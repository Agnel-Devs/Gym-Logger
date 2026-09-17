# 🏋️ Gym Logger

### Track Your Workouts. Monitor Your Progress. Stay Consistent.

**Gym Logger** is a web-based workout tracking application designed to help users record, organize, and monitor their gym activities in one place.

The application provides a centralized platform for maintaining workout records instead of relying on handwritten notes or scattered information.

Built with **Django** on the backend and a dedicated frontend, Gym Logger provides a foundation for managing exercises, workouts, and fitness-related records through a web interface.

---

## 🌐 Live Demo

**Live Application:**
https://gym-tracker-eight-topaz.vercel.app/

**GitHub Repository:**
https://github.com/Agnel-Devs/Gym-Logger

---

# 📑 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Objectives](#-objectives)
* [Features](#-features)
* [Application Workflow](#-application-workflow)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Backend](#-backend)
* [Frontend](#-frontend)
* [Database](#-database)
* [API and Data Flow](#-api-and-data-flow)
* [Getting Started](#-getting-started)
* [Local Development](#-local-development)
* [Configuration](#-configuration)
* [Deployment](#-deployment)
* [Security Considerations](#-security-considerations)
* [Testing](#-testing)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [License](#-license)

---

# 📌 Overview

Maintaining a consistent workout routine is easier when users can clearly record what they have done and refer back to previous sessions.

Gym Logger provides a digital alternative to traditional workout notebooks.

Users can use the application to maintain structured workout information, making it easier to:

* Record workout sessions
* Keep track of exercises
* Maintain workout history
* Organize training information
* Review previous workouts
* Build consistency over time

The project combines a **Django backend**, a frontend interface, and a database layer into a single web application.

---

# ❗ Problem Statement

Many people still track their gym workouts using:

* Notes applications
* Paper notebooks
* Spreadsheets
* Memory
* Multiple disconnected applications

These approaches can make workout information difficult to organize and review.

Important information such as exercises, sets, repetitions, and workout history can become scattered.

### The problem

> **Users need a simple and structured way to record and manage their workout information digitally.**

Gym Logger addresses this by providing a dedicated workout-tracking application.

---

# 💡 Solution

Gym Logger provides a centralized web platform where workout information can be stored and managed.

The application follows a simple architecture:

```text
User
 │
 ▼
Frontend
 │
 ▼
Django Backend
 │
 ▼
Workout Application
 │
 ▼
Database
```

This separation allows the user interface and backend logic to evolve independently.

---

# 🎯 Objectives

The main objectives of Gym Logger are:

### 1. Digital Workout Tracking

Replace manual workout notes with a structured digital system.

### 2. Organized Records

Store workout-related information in a consistent database structure.

### 3. Easy Access

Provide a web interface that allows users to interact with their workout records.

### 4. Maintainability

Use Django's application structure to keep backend functionality organized.

### 5. Extensibility

Create a foundation that can later support advanced analytics, authentication, recommendations, and other fitness features.

---

# ✨ Features

## 📝 Workout Logging

Gym Logger is designed around maintaining structured workout records.

Users can record workout-related information instead of maintaining separate notes.

---

## 🏋️ Exercise Management

The project includes a dedicated Django application for workout-related functionality.

This provides a foundation for managing exercises and workout records within the backend.

---

## 📚 Workout History

Recorded workout information can be maintained as historical data.

This allows users to refer back to previous sessions rather than relying on memory.

---

## 🌐 Web-Based Interface

Gym Logger is accessible through a web interface, making the application usable from supported browsers without requiring a dedicated desktop application.

---

## 🗄️ Persistent Data Storage

Workout information is stored in a database rather than existing only temporarily in the browser.

The repository currently includes a SQLite database:

```text
db.sqlite3
```

---

## 🔌 Django Backend

The application uses Django for backend functionality.

Django provides:

* URL routing
* Application structure
* Database integration
* Models
* Views
* Administrative capabilities
* Request/response handling

---

# 🔄 Application Workflow

The general workflow of the application can be represented as:

```text
        ┌──────────────┐
        │    User      │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   Frontend   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │    Django    │
        │    Backend   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   Workouts   │
        │     App      │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   SQLite DB  │
        └──────────────┘
```

### Step-by-step

1. The user interacts with the frontend.
2. The frontend communicates with the Django application.
3. Django processes the request.
4. Workout-related logic is handled by the `workouts` application.
5. Data is stored or retrieved from the database.
6. The result is returned to the frontend.

---

# 🏗️ System Architecture

Gym Logger follows a modular web application architecture.

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Frontend        │
                    │                      │
                    │ UI / User Interaction│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Django Server     │
                    │                      │
                    │ Routing / Processing │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Workouts Django App │
                    │                      │
                    │ Workout Logic / Data │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       SQLite         │
                    │      Database        │
                    └──────────────────────┘
```

---

# 🧰 Technology Stack

| Layer |

