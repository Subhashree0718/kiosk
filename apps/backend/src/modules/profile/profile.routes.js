import { Router } from 'express';
import { getFullProfile } from './profile.controller.js';

export const profileRouter = Router();

// GET /api/v1/profile/:mobile  → full aggregated profile + history
profileRouter.get('/:mobile', getFullProfile);
