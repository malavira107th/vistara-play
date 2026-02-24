// Vercel serverless function entry point
// All /api/* requests are routed here by vercel.json
import { createApp } from "../dist/index.js";

let appPromise = null;

export default async function handler(req, res) {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return app(req, res);
}
