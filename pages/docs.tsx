import React from "react";
import AddTodo from "../components/AddTodo";
import Link from "next/link";

const DocsPage = () => {
  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">How to use Todos App</h2>
      <div>
        <h3 className="mb-4 text-2xl font-bold">Quick Start:</h3>
        <div className="px-4 mb-4">
          <ol className="list-decimal">
            <Link className="hover:underline" href="/signin">
              <li>Sign in.</li>
            </Link>
            <Link className="hover:underline" href="/">
              <li>View tasks.</li>
            </Link>
            <li>Open a task by clicking on it.</li>
            <li>Add notes, links, and images to document your work.</li>
            <li>Click 'Done' when task is completed.</li>
          </ol>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-2xl font-bold">Introduction:</h3>
          <p>
            The Todos App is a web-based application that allows users to create
            and manage todo lists. It provides a simple and intuitive user
            interface that makes it easy to add, update, and delete tasks. Users
            can log in and view todos assigned to them, and can also mark them
            as completed. The app provides a comprehensive list of features that
            make it an ideal tool for managing tasks.
          </p>

          <h3 className="text-2xl font-bold">Authentication:</h3>
          <p>
            Users are required to sign in to use the Todo App. If their email
            address is authorized, they will be logged in. The app supports
            authentication using email and password or through third-party
            providers, namely Google. Once logged in, users can view their
            assigned tasks.
          </p>

          <h3 className="text-2xl font-bold">View Todos:</h3>
          <p>
            The main page of the Todo App displays all the todos assigned to the
            user. The page contains a list of todos with their title, due date,
            and a short description. Each todo has a checkbox next to it
            indicating whether it is complete or not. If the user has not
            interacted with the todo, a raised hand icon will be displayed next
            to their name. However, if the user has interacted with the todo, a
            check mark will be displayed instead. This suggests that the user
            has acknowledged the todo.
          </p>

          <h3 className="text-2xl font-bold">Add Notes and Images:</h3>
          <p>
            Users can add notes and images to a todo by clicking on it. This
            opens a new page that allows the user to add additional details
            about the task. Users can write notes and upload images to provide
            more information about the todo.
          </p>

          <h3 className="text-2xl font-bold">Set as Complete:</h3>
          <p>
            Once a todo is complete, users can click the "Done" button to set
            the todo in the Completed state. The todo author will be notified
            and the author can set the state of the todo to Approved. Once
            approved, the todo will be removed from the list of todos and added
            to the Approved Todos archive.
          </p>

          <h3 className="text-2xl font-bold">Todo Color Coding</h3>
          <p className="mb-2">
            Color-coded background highlights provide a visual cue for users to
            quickly identify and prioritize their tasks based on their deadlines
            and completion status.
          </p>
          <p className="mb-2">
            The background color of a todo item varies according to the
            following rules:
          </p>
          <ol className="pl-6 list-decimal list-outside">
            <li className="mb-2">
              If the todo item is marked as completed, its background color will
              be light gray.
            </li>
            <li className="mb-2">
              If the todo item is overdue (due date has already passed), its
              background color will be red.
            </li>
            <li className="mb-2">
              If the todo item is due within the next 2 days (including today),
              its background color will be deep pink.
            </li>
            <li className="mb-2">
              If the todo item is due within the next 5 days (excluding the
              previous category), its background color will be orange.
            </li>
            <li className="mb-2">
              If the todo item is due within the next 10 days (excluding the
              previous categories), its background color will be yellow.
            </li>
            <li className="mb-2">
              If the todo item is due more than 10 days from now, its background
              color will be light green.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
