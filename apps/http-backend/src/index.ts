import express from "express"
import prismaClient from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/todo" , async (req , res) => {
    try {
        const { title, completed } = req.body
        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "Missing or invalid 'title'" });
        }

        const result = await prismaClient.todo.create({
            data: {
                title,
                completed: completed ?? false,
            }
        });

        res.status(201).json(result);
    } catch (e: any) {
        res.status(500).json({ error: e?.message ?? "Internal server error" });
    }
})

app.listen(8081 ,"0.0.0.0", () => {
    console.log("Server 8081")
})

