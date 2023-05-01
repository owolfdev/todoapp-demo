import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface Todo {
  completed: boolean;
  created_at: string;
  description: string;
  due_date: string;
  id: string;
  images: string[];
  title: string;
  assigned_to: string;
  notes: string | null;
}

const UpdateTodo: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    async function fetchTodo() {
      if (typeof id === "string") {
        const res = await fetch(`/api/todo?id=${id}`);
        const data: Todo = await res.json();
        setTodo(data);
        setTitle(data.title);
        setDescription(data.description);
        setDueDate(data.due_date);
        setImages(data.images);
        setAssignedTo(data.assigned_to);
      }
    }

    if (id) {
      fetchTodo();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/updateTodo", {
        id,
        title,
        description,
        due_date: dueDate,
        images,
        assigned_to: assignedTo,
      });
      console.log("Todo updated", data);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Add your input fields and other elements here */}
        {/* Example: */}
        {/* Title, Description, Due Date, Images, Assigned To */}
        {/* Don't forget to update their values and onChange handlers */}
      </form>
    </div>
  );
};

export default UpdateTodo;
