// pages/api/updateTodo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      id,
      title,
      due_date,
      completed,
      images,
      description,
      assigned_to,
      notes,
      acknowledged, // Add this line
      approved,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const { data, error } = await supabase
      .from("todos_for_ch60")
      .update({
        title,
        completed,
        due_date,
        images,
        description,
        assigned_to,
        notes,
        acknowledged, // Add this line
        approved,
      })
      .eq("id", id);

    if (error) {
      res.status(400).json({ error });
    } else {
      res.status(200).json(data && data[0]);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
