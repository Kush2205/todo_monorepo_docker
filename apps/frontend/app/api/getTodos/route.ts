import prismaClient from "@repo/db/client";

export async function GET() {
  try {
    const todos = await prismaClient.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch todos" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
