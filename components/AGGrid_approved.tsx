import React, { useMemo, useState, useCallback, useEffect, FC } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  IsFullWidthRowParams,
  RowHeightParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";
import axios from "axios";
import { log } from "console";
import { formatDate } from "../lib/dateUtils";
import { FaRegHandPointRight } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaHandPaper } from "react-icons/fa";

type data = {
  completed: boolean;
  created_at: string;
  description: string;
  due_date: string;
  id: string;
  images: string[];
  title: string;
  assigned_to: string;
  acknowledged: boolean;
};

interface AGGridProps {
  path: string;
}

const FullWidthGrid: React.FC<AGGridProps> = ({ path }) => {
  const [agGridTheme, setAgGridTheme] = useState("ag-theme-alpine");
  const [rowData, setRowData] = useState<data[]>([]);
  const router = useRouter();
  const currentPath = router.asPath;
  const pathSegments = currentPath.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const session = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const { data } = await axios.get("/api/todosCompleted");
  //       setRowData(data);
  //       console.log("Data:", data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/todosApproved");
      setRowData(data);
      //console.log("Data:", data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    //console.log("subscribing to realtime changes");
    //const [todos, setTodos] = useState<data[]>(rowData);
    const channel = supabase
      .channel("realtime todos approved")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "todos_for_ch60" },
        (payload: any) => {
          //console.log("Change received!", payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    checkIsMobile(); // Call the function initially to set the correct value for isMobile
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkIsMobile);
      return () => {
        window.removeEventListener("resize", checkIsMobile);
      };
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDescriptionLength(80);
    } else {
      setDescriptionLength(200);
    }
  }, [isMobile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

      const handleDarkModeChange = (e: any) => {
        if (e.matches) {
          setAgGridTheme("ag-theme-alpine-dark");
        } else {
          setAgGridTheme("ag-theme-alpine");
        }
      };

      handleDarkModeChange(darkMode);

      darkMode.addEventListener("change", handleDarkModeChange);

      return () => {
        darkMode.removeEventListener("change", handleDarkModeChange);
      };
    }
  }, []);

  const checkIsMobile = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
    }
  };

  const containerStyle = useMemo(
    () => ({ width: "100%", height: "880px" }),
    []
  );

  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs] = useState<ColDef[]>([
    { field: "title" },
    {
      headerName: "Due Date",
      field: "due_date",
      sortable: true,
      sort: "asc",
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      headerName: "Completed",
      field: "completed",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const value = params.value;
        return value ? "Yes" : "No";
      },
    },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true,
      filter: true,
      suppressMovable: true,
    };
  }, []);

  const isFullWidthRow = useCallback((params: IsFullWidthRowParams) => {
    return true;
  }, []);

  const getRowHeight = useCallback((params: RowHeightParams) => {
    return 130;
  }, []);

  const handleComplete = async (e: any, id: string, completed: boolean) => {
    e.preventDefault();
    //console.log("complete clicked");

    //console.log("id", id);

    //console.log("completed", completed);

    const { data, error } = await supabase
      .from("todos_for_ch60")
      .update({ completed: !completed })
      .eq("id", id);
    if (error) {
      console.log("error", error);
    } else {
      console.log("data", data);

      // Update rowData with the modified data
      const updatedRowData = rowData.map((row) => {
        if (row.id === id) {
          return { ...row, completed: !completed };
        }
        return row;
      });

      setRowData(updatedRowData);
    }
  };

  const fullWidthCellRenderer = ({ node }: any) => {
    const {
      title,
      id,
      due_date,
      description,
      completed,
      assigned_to,
      acknowledged,
    } = node.data;
    return (
      <div
        key={id}
        // title={description}
        className="px-5 py-2 text-gray-900 my-full-width-row"
      >
        <Link href={`/todo/${id}`}>
          <div className="">
            <h2 className="font-sans text-2xl font-bold sm:text-2xl">
              {title}
            </h2>
          </div>

          <div className="flex space-x-2 text-gray-800">
            <div>|</div>
            <div className="flex items-center space-x-1 text-sm cursor-pointer">
              {/* <span className="font-bold">Assigned To: </span> */}
              <AiOutlineCheckCircle />
              <span className="font-bold">{assigned_to}</span>
            </div>
            <div>|</div>
            <div className="text-sm">
              <span className="font-bold">Due: </span>
              {formatDate(due_date)}
            </div>

            <div>|</div>
            <div className="text-sm">
              {/* <span className="font-bold">
              <button
                onClick={(e) => handleComplete(e, id, completed)}
                title="click to complete"
              >
                Completed:
              </button>{" "}
            </span> */}
              {/* {completed ? (
              <button
                onClick={(e) => handleComplete(e, id, completed)}
                title="click to set un-complete"
                className="px-2 font-bold bg-gray-200 border border-gray-500 rounded hover:text-gray-500"
              >
                Complete
              </button>
            ) : (
              <button
                onClick={(e) => handleComplete(e, id, completed)}
                title="click to complete"
                className="px-2 font-bold bg-gray-200 border border-gray-500 rounded hover:text-gray-500"
              >
                Todo
              </button>
            )} */}
              <div>
                <span className="px-2 py-1 font-bold bg-green-200 border rounded">
                  Approved
                </span>
              </div>
            </div>
          </div>
          <div className="w-full mt-4 text-sm whitespace-pre-wrap">
            {`${description.substring(0, descriptionLength)}...`}
          </div>
        </Link>
      </div>
    );
  };
  const getBackgroundColor = (dueDate: string): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return "lightgray";
    } else if (daysDiff <= 7) {
      return "lightgray";
    } else if (daysDiff <= 14) {
      return "lightgray";
    } else {
      return "lightgray";
    }
  };

  const getRowStyle = (params: any) => {
    const backgroundColor = getBackgroundColor(params.data.due_date);
    return { background: backgroundColor };
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={`${agGridTheme} my-grid`}>
        <AgGridReact
          key={rowData.length} // Add this line
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          isFullWidthRow={isFullWidthRow}
          getRowHeight={getRowHeight}
          components={{ fullWidthCellRenderer }}
          fullWidthCellRenderer="fullWidthCellRenderer"
          pagination={true}
          paginationPageSize={6}
          getRowStyle={getRowStyle}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default FullWidthGrid;
