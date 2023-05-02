import React from "react";
import AddTodo from "../components/AddTodo";

const AddTodoPage = () => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Add a new Todo</h2>
      <p className="mb-4">This is a demo app. Feel free to create a todo.</p>
      <AddTodo />
    </div>
  );
};

export default AddTodoPage;
