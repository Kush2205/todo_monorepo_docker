"use client";

import { useEffect, useState } from "react";
export default function Home() {
  
  const [todos , setTodos] = useState<any>([]);
  
  useEffect(() => {
    let ws: WebSocket | null = null;

    const load = async () => {
      try {
        const res = await fetch("/api/getTodos", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setTodos(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    load();

    ws = new WebSocket("ws://websocket:8080");
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        if (Array.isArray(data.todos)) {
          setTodos(data.todos);
        }
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);




  return (
    <div className="flex flex-col min-h-screen p-4 bg-neutral-800">
    <ul className="grid grid-cols-5 gap-4 w-full">
        {todos.map((todo : any) => (
      <div className="h-32 text-black text-2xl font-bold flex justify-center items-center bg-amber-400 rounded-xl" key={todo.id}>{todo.title}</div>
        ))}
      </ul>
    </div>
  );
}

 