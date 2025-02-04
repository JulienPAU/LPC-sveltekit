// src/routes/auth/signout/+page.server.ts
import { signOut } from "../../../auth";

import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        await signOut(event);
    }
};
