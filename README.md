# GifuEngine

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Description

GifuEngine is a robust library designed to manage a vast collection of Go (Baduk) opening board positions and games. It supports operations on SGF files, including parsing, sorting, and adding new games. The project aims to provide an extensive library of 4 million sorted games and opening positions up to move 50, accessible through an API.

## Features

- Parse and manipulate SGF files.
- Sort and manage a large library of Go games.
- API for accessing game data.
- Modular components for easy integration and extension.
- WebSocket support for real-time updates.

## Project Structure

Src/
|__ GifuEngine/
| |__ SGFAdapter.ts
| |__ BoardStateHashingEngine.ts
| |__ GobanEngine.ts
| |__ FileHandler.ts
|
|__ Components/
| |__ SGFAdapter.ts
| |__ BoardStateHashingEngine.ts
| |__ GobanEngine.ts
| |__ FileHandler.ts
|
Server/
|__ BackendEngine.ts
|__ DatabaseAPI.ts
|__ WebSocketServer.ts
|
Client/
|__ FrontendEngine.ts
|__ WebSocketClient.ts
|
Web/
|__ index.html
|__ styles.css
|__ app.js
|
SGF/


## Installation

### Prerequisites

- [Deno](https://deno.land/) (latest version)
- [Rust](https://www.rust-lang.org/tools/install) (latest version)

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/GifuEngine.git
    cd GifuEngine
    ```

2. Install dependencies:
WIP

## Usage

### Running the Server

Start the backend server:
WIP
