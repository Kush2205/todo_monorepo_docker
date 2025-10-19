import { WebSocketServer } from "ws";
import prismaClient from "@repo/db/client";
import axios from "axios";
const wss = new WebSocketServer({ host:"0.0.0.0" , port: 8080 } , () => {
    console.log("WebSocket server started on port 8080");
});

wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
        const parsedMessage = JSON.parse(message.toString());

        if (!parsedMessage) {
            ws.send(JSON.stringify({ error: "Message cannot be empty" }));
            return;
        }

        if (parsedMessage.command == "addTodo") {
            try {
                await axios.post(
                    "http://http-backend:8081/todo",
                    { title: parsedMessage.title },
                    { headers: { "Content-Type": "application/json" } }
                );

                const todos = await prismaClient.todo.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                });
                
                const payload = JSON.stringify({ todos, message: "Todo added successfully" });
                wss.clients.forEach((client) => {
                    // @ts-ignore
                    if (client.readyState === 1) {
                        client.send(payload);
                    }
                });
            } catch (e: any) {
                ws.send(JSON.stringify({ error: e?.message ?? "Internal server error" }));
            }
        }

    })
});