// frontend/cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Add your event listeners here
    },
    baseUrl: "http://localhost:5173", // Use the correct URL for your frontend app
  },
});
