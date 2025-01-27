// src/routes/api/uploadthing/+server.ts

import { env } from "$env/dynamic/private";
import { uploadRouter } from "$lib/server/uploadthing";

import { createRouteHandler } from "uploadthing/server";

const handlers = createRouteHandler({
    router: uploadRouter,
    config: {
        token: env.UPLOADTHING_TOKEN,
    },
});

export { handlers as GET, handlers as POST };
