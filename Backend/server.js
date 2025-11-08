require("dotenv").config();

const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

// Start the server
async function startServer() {
  try {
    await MongoDB.connect();

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
