# FullStackProjects

A growing collection of full-stack applications built with **Angular** and **ASP.NET Core Web API**, organized by difficulty from beginner to advanced. Each project focuses on a specific set of real-world concepts: authentication, real-time communication, file handling, business logic, and modern Angular patterns.

The projects are part of the **"طب نجرب؟"** series, where I build one project at a time and share what I learned along the way.

## Repository Structure

```
FullStackProjects/
├── Beginner/              # Foundational projects
├── Intermediate/          # More complex features and architecture
├── FullStackProjects.slnx # Solution file for the backend projects
└── .gitignore
```

## Projects

| # | Project | Level | Description |
|---|---------|-------|-------------|
| 1 | **TaskFlow** | Beginner | Task management app — the first project in the series |
| 2 | _TBD_ | _TBD_ | _TBD_ |
| 3 | **Momento** | Intermediate | Memories app with secure authentication and file uploads |
| 4 | **Lost & Found** | Intermediate | Lost and found items with keyword matching and real-time updates |
| 5 | **RentEase** | Intermediate | Equipment rental app with date-range booking |

### Momento
- Angular with **Signals** and **Signal Forms**
- **ASP.NET Core Identity** for user management
- **JWT stored in HttpOnly cookies**
- File uploads

### Lost & Found
- Keyword-matching logic between lost and found items
- **SignalR** for real-time updates
- Authentication with a **refresh-token** flow

### RentEase
- Date-range booking logic
- Angular **Input Signals**

## Tech Stack

- **Frontend:** Angular, TypeScript
- **Backend:** ASP.NET Core Web API, C#
- **Real-time:** SignalR
- **Auth:** ASP.NET Core Identity, JWT

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (a recent version with `.slnx` support)
- [Node.js](https://nodejs.org/) and the [Angular CLI](https://angular.dev/tools/cli)

### Clone the repository

```bash
git clone https://github.com/IbrahimShafiq4/FullStackProjects.git
cd FullStackProjects
```

### Run a project

Each project has its own backend and frontend. Open the project folder you want, then:

**Backend**

```bash
cd <ProjectFolder>/<BackendFolder>
dotnet restore
dotnet run
```

**Frontend**

```bash
cd <ProjectFolder>/<FrontendFolder>
npm install
ng serve
```

Then open `http://localhost:4200`.

> Some projects may need extra configuration (connection strings, JWT settings). Check `appsettings.json` inside the backend project.

## Author

**Ibrahim Shafiq Abd El-Shafi**

- GitHub: [@IbrahimShafiq4](https://github.com/IbrahimShafiq4)
