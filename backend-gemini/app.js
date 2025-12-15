import express from "express";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Gemini AI attivo su http://localhost:${PORT}`);
});
