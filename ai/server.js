const app = require("./app");
const dotenv = require('dotenv');

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });


const PORT = process.env.AI_PORT || 5030;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));
