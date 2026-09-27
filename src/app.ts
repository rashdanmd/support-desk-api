import express from "express";
import cors from "cors";
import teamRoutes from "./features/teams/routes";
import ticketRoutes from "./features/tickets/routes";
import responseRoutes from "./features/responses/routes";
import userRoutes from "./features/users/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/teams", teamRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", responseRoutes);
app.use("/api/users", userRoutes);

export default app;
