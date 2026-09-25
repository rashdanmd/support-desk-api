import express from "express";
import cors from "cors";
import teamRoutes from "./routes/team-routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/teams", teamRoutes);

export default app;
