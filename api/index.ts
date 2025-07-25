import { Hono } from "hono";
import router from "./routers/index.js";
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'

const app = new Hono().basePath('/api')

app.use(cors())
app.route("/", router);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

