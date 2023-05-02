// pages/api/refresh-due-date.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    try {
      // Fetch all rows from the table
      const { data, error } = await supabase
        .from("todos_for_todo_demo")
        .select("*");

      if (error) {
        throw error;
      }

      // Sort rows by due_date in ascending order
      data.sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );

      // Calculate the offset based on the earliest due_date
      const earliestDueDate = new Date(data[0].due_date);
      const today = new Date();
      const offset = today.getTime() - earliestDueDate.getTime();

      // Update the due_date for each row according to the offset
      const updatedData = await Promise.all(
        data.map(async (row) => {
          const newRowDueDate = new Date(
            new Date(row.due_date).getTime() + offset
          );

          const { data: updatedRow, error } = await supabase
            .from("todos_for_todo_demo")
            .update({ due_date: newRowDueDate })
            .eq("id", row.id);

          if (error) {
            throw error;
          }

          return updatedRow;
        })
      );

      res
        .status(200)
        .json({ message: "Due dates updated successfully", data: updatedData });
    } catch (error) {
      res.status(400).json({
        message: "Error updating due dates",
        error: (error as Error).message,
      });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
