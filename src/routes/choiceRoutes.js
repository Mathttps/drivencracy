import { Router } from "express";
import { createChoice, createChoiceId } from "../controllers/choice.js";

const choiceRoutes = Router();

choiceRoutes.post("/choice", createChoice);
choiceRoutes.post("/choice/:id/vote", createChoiceId);

export default choiceRoutes;