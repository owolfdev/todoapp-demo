import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { author } = req.query;

  try {
    const { data, error } = await supabase
      .from("todos_for_todo_demo")
      .select("*")
      .eq("author", author);

    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
