export const APP_CONFIG = {
  // Public AWS Cognito configuration placeholders
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "ap-south-1_R3LAYPool",
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "r3lay-tte-client-app",
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || "ap-south-1",
  },
  // API Gateway base endpoint (routes to Lambda/Backend)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
  system: {
    appName: "R3LAY",
    tagline: "Rethink. Reallocate. Ride.",
    subsystem: "Smart Train Seat Management System",
    organization: "Indian Railways (IRCTC / CRIS)",
    solverEngine: "Google OR-Tools CP-SAT (FastAPI)",
    bedrockModel: "AWS Bedrock (Claude 3 Sonnet)",
  }
};
