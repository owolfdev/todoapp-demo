import React, { useState, useEffect } from "react";
//import { useSession } from "@supabase/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

export interface Todo {
  completed: boolean;
  created_at: string;
  description: string;
  due_date: string;
  id: string;
  images: string[];
  title: string;
  assigned_to: string;
  author: string;
  user_id: string;
}

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [author, setAuthor] = useState("");
  //const [session] = useSession();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    } else {
      //console.log("session", session);
    }
  }, [session]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray: File[] = Array.from(files);
      const fileUrlArray: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        fileUrlArray.push(URL.createObjectURL(fileArray[i]));
      }
      setImages((prevImages) => [...prevImages, ...fileUrlArray]);
      for (let i = 0; i < fileArray.length; i++) {
        URL.revokeObjectURL(fileUrlArray[i]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (!dueDate) {
      alert("Please enter a due date.");
      return;
    }
    try {
      const { data } = await axios.post("/api/createTodo", {
        title,
        description,
        due_date: dueDate,
        images,
        assigned_to: assignedTo,
        author: session?.user?.email,
        user_id: session?.user?.id,
      });
      //console.log("Todo created", data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setImages([]);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-gray-900 border-2 border-gray-400 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">
            Assigned To:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 text-gray-900 border-2 border-gray-400 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-bold">
            Task:
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-[200px] w-full p-2 text-gray-900 border-2 border-gray-400 rounded "
          />
        </div>
        <div className="mb-4">
          <label htmlFor="due_date" className="block mb-2 font-bold">
            Due Date:
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 text-gray-900 border-2 border-gray-400 rounded"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Add Todo
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-red-500 rounded"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;
