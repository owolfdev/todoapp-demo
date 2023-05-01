import React, { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  due_date: string;
  description: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("todos", todos);
  }, [todos]);

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-4">
            <div>
              <h3 className="text-xl">{todo.title}</h3>
              <p className="text-gray-500">Created: {todo.created_at}</p>
              <p className="text-gray-500">Due: {todo.due_date}</p>
              <p>{todo.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
