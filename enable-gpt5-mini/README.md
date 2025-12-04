# Enable GPT-5 Mini

This project is designed to enable the GPT-5 mini feature for clients through a structured server application. Below are the details regarding the setup, usage, and structure of the project.

## Project Structure

```
enable-gpt5-mini
├── src
│   ├── index.ts                # Entry point of the application
│   ├── server.ts               # Server configuration and routing
│   ├── controllers             # Contains controllers for handling requests
│   │   └── rolloutController.ts # Handles requests related to feature rollouts
│   ├── services                # Contains business logic for the application
│   │   └── rolloutService.ts    # Manages feature rollouts
│   ├── config                  # Configuration files
│   │   └── featureFlags.ts      # Defines feature flags
│   ├── models                  # Data models
│   │   └── client.ts            # Represents the client model
│   └── types                   # Type definitions
│       └── index.ts             # Exports interfaces for type definitions
├── scripts                     # Scripts for various tasks
│   └── migrate.ts               # Database migration scripts
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd enable-gpt5-mini
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Run migrations (if necessary):**
   ```bash
   npm run migrate
   ```

## Usage

- The application exposes endpoints for enabling and disabling the GPT-5 mini feature for clients. 
- Use the `RolloutController` to handle requests related to feature management.
- The `RolloutService` contains the business logic for managing the state of features.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.