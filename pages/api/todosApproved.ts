import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("todos_for_ch60")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(400).json({ error });
    } else {
      res.status(200).json(data);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
