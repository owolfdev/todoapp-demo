// pages/api/createTodo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../lib/supabaseClient";
import { sendSlackMessage } from "@/lib/sendSlack";
import { log } from "console";
import { Todo } from "@/components/AddTodo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      title,
      description,
      due_date,
      images,
      assigned_to,
      author,
      user_id,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const { data, error } = await supabase
        .from("todos_for_todo_demo")
        .insert([
          {
            title,
            description,
            due_date,
            images,
            assigned_to,
            author,
            user_id,
          },
        ])
        .select("*");

      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(200).json(data && data[0]);

        const todo = data[0] as Todo;

        console.log("data from create todo api", todo.id);

        // Send a Slack notification when a todo is successfully created
        const slackChannel = "#todo"; // Replace with the desired Slack channel ID or name
        const slackMessage = `Todo: ${title}\nAssigned to: ${assigned_to}\nDue date: ${due_date}\nhttps://todozapp.vercel.app/todo/${todo.id}`;
        await sendSlackMessage(slackChannel, slackMessage);
      }
    } catch (error) {
      console.error("Error inserting todo into Supabase:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
