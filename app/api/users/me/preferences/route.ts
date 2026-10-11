import {
    getPreferences,
    updatePreferences,
} from "@/src/backend/controllers/preferences.controller";

export const GET = getPreferences;
export const PATCH = updatePreferences;