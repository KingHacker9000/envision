# Natural Disaster Visualization Project 🚀

Welcome to the **Natural Disaster Visualization Project**! This project aims to create an interactive web-based visualization tool that allows users to simulate the effects of flooding in their towns and neighborhoods. The primary goal is to raise awareness about climate change and its impact and for further research and climate mitigation strategies.

## Table of Contents 📚

- [Overview](#overview)
- [Goals & Objectives](#goals--objectives)
- [Features](#features-)
- [Getting Started](#getting-started-)
- [Project Structure](#project-structure-)
- [Available Scripts](#available-scripts-)
- [Dependencies](#dependencies-)
- [Contributing](#contributing-)
- [License](#license-)

## Overview 📌

This project aims to create an interactive web-based visualization tool that allows users to simulate the effects of flooding in their towns and neighborhoods. The primary goal is to raise awareness about climate change and its impact.

## Goals & Objectives 🎯

- **Awareness**: Help the public visualize climate risks in their communities.
- **Fundraising**: Support research efforts in climate change mitigation.
- **Interactive Simulation**: Allow users to adjust flood severity, water levels, and location dynamically.
- **Scalability**: Design a modular system to incorporate other natural disasters (wildfires, hurricanes, earthquakes) in the future.

## Features ✨

- **React Three Fiber**: Leverage the power of Three.js within the React ecosystem.
- **@react-three/drei**: A collection of useful helpers and abstractions for R3F.
- **@react-three/rapier**: Physics engine integration for realistic simulations.
- **Express Server**: Serve your application with a simple Express server.
- **Vite**: Fast and modern build tool for blazing fast development.

## Getting Started 🚀

To get started with this project, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/KingHacker9000/envision.git
    cd envision
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the development server**:
    ```sh
    npm run dev
    ```

4. **Build the project for production**:
    ```sh
    npm run build
    ```

5. **Preview the production build**:
    ```sh
    npm run preview
    ```

## Project Structure 🗂️

Here's a quick overview of the project's structure:

```
r3f-starter/
├── dist/                   # Production build output
├── node_modules/           # Node.js modules
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Experience.css  # Main 3D experience styles
│   │   ├── Experience.jsx  # Main 3D experience component
│   │   ├── Loader.jsx      # Loading screen component
│   │   └── Loader.css      # Styles for the loader
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   ├── main.jsx            # Entry point for the React application
├── .gitignore              # Git ignore file
├── index.html              # HTML template
├── package.json            # Project metadata and scripts
├── Procfile                # Heroku deployment configuration
├── server.js               # Express server setup
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## Available Scripts 📜

In the project directory, you can run the following scripts:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build.
- `npm start`: Starts the Express server.

## Dependencies 📦

This project relies on the following key dependencies:

- `@react-three/drei`: ^9.111.3
- `@react-three/fiber`: ^8.17.6
- `@react-three/rapier`: ^1.5.0
- `express`: ^4.21.1
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.0.2
- `three`: ^0.167.1

## Contributing 🤝

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

Happy coding! 🚀
