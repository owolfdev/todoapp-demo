import { useRouter } from "next/router";
import { useEffect, useState, ChangeEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Cloudinary } from "@cloudinary/url-gen";
import UploadWidget from "../../components/UploadWidget";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { log } from "console";
import { ImCancelCircle } from "react-icons/im";

type Todo = {
  id: string;
  created_at: string;
  due_date: string;
  title: string;
  description: string;
  images: string[];
  completed: boolean;
  assigned_to: string;
  notes: string | null;
  approved: boolean;
  author: string;
};

const adminEmails = ["oliverwolfson@gmail.com", "owolfdev@gmail.com"];

const url = "/api/cloudinary-upload";
const options = {
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const TodoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [updateNotesTimeout, setUpdateNotesTimeout] = useState<number | null>(
    null
  );
  const [notes, setNotes] = useState<string | null>(null);
  const [approved, setApproved] = useState<boolean | null>(false);
  const [completed, setCompleted] = useState<boolean | null>(false);
  const session = useSession();
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [url, updateUrl] = useState();
  const [error, updateError] = useState();

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "demo",
    },
  });

  // useEffect(() => {
  //   // if (!session) {
  //   //   router.push("/signin");
  //   // }

  //   if (session?.user && session.user.email) {
  //     if (allowedEmails.includes(session.user.email)) {
  //     } else {
  //       console.error("Unauthorized email:", session.user.email);
  //       signOut();
  //     }
  //   }
  // }, [session]);

  useEffect(() => {
    // if (!session) {
    //   router.push("/signin");
    // }

    if (session) {
      const { user } = session;
      if (user) {
        const { email } = user;
        if (email) {
          if (adminEmails.includes(email)) {
            setUserIsAdmin(true);
          }
        }
      }
    }
  }, [session]);

  async function fetchTodo() {
    if (typeof id === "string") {
      const res = await fetch(`/api/todo?id=${id}`);
      const data: Todo = await res.json();
      console.log("fetchTodo data:", data);
      setTodo(data);
    }
  }

  useEffect(() => {
    if (id) {
      fetchTodo();
    }
  }, [id]);

  useEffect(() => {
    //console.log("update todo, from useEffect", todo);

    if (todo) {
      setApproved(todo.approved);
      setCompleted(todo.completed);
    }
  }, [todo]);

  const updateNotes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = event.target.value;
    setNotes(newNotes);

    if (updateNotesTimeout) {
      clearTimeout(updateNotesTimeout);
    }

    setUpdateNotesTimeout(
      window.setTimeout(async () => {
        if (todo && typeof id === "string") {
          const response = await fetch("/api/updateTodo", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...todo, id, notes: newNotes }),
          });

          if (response.ok) {
            setTodo({ ...todo, notes: newNotes });
          }
        }
      }, 500)
    );
  };

  const getBackgroundColor = (dueDate: string, completed: boolean): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (completed) {
      return "lightgray";
    }

    if (daysDiff < 0) {
      return "red";
    } else if (daysDiff <= 2) {
      return "deeppink";
    } else if (daysDiff <= 5) {
      return "orange";
    } else if (daysDiff <= 10) {
      return "yellow";
    } else {
      return "lightgreen";
    }
  };

  const getStatus = (dueDate: string, completed: boolean): string => {
    const backgroundColor = getBackgroundColor(dueDate, completed);

    switch (backgroundColor) {
      case "red":
        return "Over-due";
      case "deeppink":
        return "Urgent";
      case "orange":
        return "In Queue";
      case "yellow":
        return "Coming Up Soon";
      case "lightgreen":
        return "On Track";
      case "lightgray":
        return "Completed";
      default:
        return "";
    }
  };

  const updateApprovedStatus = async (approved: boolean) => {
    if (todo && typeof id === "string") {
      const response = await fetch("/api/updateTodo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, id, approved }),
      });

      if (response.ok) {
        setTodo({ ...todo, approved });
      }
    }
  };

  const updateCompletedStatus = async (completed: boolean) => {
    if (todo && typeof id === "string") {
      const response = await fetch("/api/updateTodo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, id, completed }),
      });

      if (response.ok) {
        setTodo({ ...todo, completed });
      }
    }
  };

  const handleApproved = async () => {
    if (todo) {
      updateApprovedStatus(!todo.approved);
    }
  };

  const handleCompleted = async () => {
    if (todo) {
      updateCompletedStatus(!todo.completed);
    }
  };

  function handleOnUpload(error: any, result: any, widget: any) {
    if (error) {
      updateError(error);
      widget.close({
        quiet: true,
      });
      return;
    }

    // get the public URL of the uploaded image from the result
    const publicUrl = result.info.secure_url;

    if (typeof id === "string") {
      // First, retrieve the current todo from the database
      fetch(`/api/todo?id=${id}`)
        .then((res) => res.json())
        .then((data: Todo) => {
          // Next, update the images array of the todo with the new public URL
          const updatedImages = data.images
            ? [...data.images, publicUrl]
            : [publicUrl];

          // Finally, update the todo in the database with the new images array
          axios
            .put("/api/updateTodo", {
              ...data,
              id,
              images: updatedImages,
            })
            .then((response) => {
              console.log("response?????", response);
              if (response.status === 200) {
                console.log("response.data!!!!!", response.data);
                fetchTodo();
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  const handleDeleteImage = async (image: string) => {
    if (todo && typeof id === "string") {
      // Remove the image from the images array
      const updatedImages = todo.images.filter((img) => img !== image);

      // Update the todo in the database with the new images array
      const response = await fetch("/api/updateTodo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, id, images: updatedImages }),
      });

      if (response.ok) {
        setTodo({ ...todo, images: updatedImages });
      }
    }
  };

  return (
    <div>
      {todo && (
        <div
          style={{
            border: "2px solid #ccc",
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          <div className="mb-4">
            <h1 className="mb-1 text-4xl font-bold">{todo.title}</h1>
            <div className="flex space-x-2">
              {session?.user?.email === todo.author && (
                <button
                  className="px-2 bg-gray-200 border border-gray-300 rounded hover:text-gray-600"
                  onClick={() => router.push(`/edit/${id}`)}
                >
                  Edit
                </button>
              )}

              <button
                className="px-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => router.push(`/`)}
              >
                Back
              </button>
            </div>
          </div>
          <div className="flex flex-col mb-4 space-y-1">
            <div>
              <strong>Assigned to:</strong> {todo.assigned_to}
            </div>
            <div>
              <div className="mt-4 mb-4">
                {" "}
                <div>
                  <strong>
                    <span className="text-2xl">Task:</span>
                  </strong>{" "}
                  <div
                    className="px-4 py-3 border border-gray-300 rounded-md"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {todo.description}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <strong>
                  <span className="text-xl">Due date:</span>
                </strong>{" "}
                <span className="text-xl">
                  {new Date(todo.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div>
              <strong>Author:</strong> {todo.author}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(todo.created_at).toLocaleDateString()}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: getBackgroundColor(
                    todo.due_date,
                    todo.completed
                  ),
                }}
              >
                {getStatus(todo.due_date, todo.completed)}
              </span>
            </div>
            <div>
              <strong>Completed:</strong>{" "}
              {todo.completed ? (
                <button
                  onClick={handleCompleted}
                  className="px-2 bg-blue-200 border border-gray-300 rounded hover:text-gray-600"
                >
                  Yes
                </button>
              ) : (
                <button
                  onClick={handleCompleted}
                  className="px-2 bg-gray-200 border border-gray-300 rounded hover:text-gray-600"
                >
                  No
                </button>
              )}
            </div>
            <div>
              <strong>Approved:</strong>
              {todo.approved ? (
                <button
                  onClick={handleApproved}
                  className="px-2 bg-green-200 border border-gray-300 rounded hover:text-gray-600"
                  disabled={!userIsAdmin}
                >
                  Yes
                </button>
              ) : (
                <button
                  onClick={handleApproved}
                  className="px-2 bg-gray-200 border border-gray-300 rounded disabled:text-gray-400 hover:text-gray-600"
                  disabled={!userIsAdmin}
                >
                  No
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="notes">
              <strong>Notes:</strong>
            </label>
            <textarea
              id="notes"
              rows={6}
              cols={40}
              value={
                notes !== null ? notes : todo.notes !== null ? todo.notes : ""
              }
              onChange={updateNotes}
              style={{ resize: "none" }}
              className="px-4 py-3 border border-gray-300 rounded-md"
              placeholder="Provide links, feedback, or additonal information here..."
            ></textarea>
          </div>
          {/* upload images */}
          <div className="mt-4">
            <UploadWidget onUpload={handleOnUpload}>
              {({ open }: any) => {
                function handleOnClick(e: any) {
                  e.preventDefault();
                  open();
                }
                return (
                  <button
                    className="px-2 bg-gray-200 border border-gray-300 rounded hover:text-gray-600"
                    onClick={handleOnClick}
                  >
                    Upload an Image
                  </button>
                );
              }}
            </UploadWidget>
          </div>
          {/*  */}
          {todo.images.map((image, index) => (
            <li key={index} className="relative list-none">
              <img src={image} alt={`Image ${index + 1}`} />
              {session?.user?.email === todo.author && (
                <button
                  className="absolute p-1 text-white bg-red-500 rounded-xl top-2 right-2"
                  onClick={() => handleDeleteImage(image)}
                >
                  <ImCancelCircle />
                </button>
              )}
            </li>
          ))}

          {/*  */}
        </div>
      )}
    </div>
  );
};

export default TodoPage;
