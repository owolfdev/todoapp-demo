import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    // console.log("id from delete todo!!!!!!", id);

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const { data, error } = await supabase
      .from("todos_for_ch60")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(400).json({ error });
    } else {
      res.status(200).json(data && data[0]);
    }

    //
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
