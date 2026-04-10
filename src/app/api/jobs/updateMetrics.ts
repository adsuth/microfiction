import { revalidatePath } from "next/cache"
import { db_updateAllStoryMetrics } from "@/lib/db/post"

export async function GET(request: Request) {
    // see https://console.cron-job.org/
    const auth = request.headers.get("authorization")
    const username = process.env.CRON_USERNAME
    const password = process.env.CRON_PASSWORD
    
    if (!username || !password) {
        return new Response("Unauthorized", { status: 401 })
    }

    const expected = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`

    if (auth !== expected) {
        return new Response("Unauthorized", { status: 401 })
    }

    await db_updateAllStoryMetrics()
    revalidatePath("/")

    return Response.json({ ok: true })
}