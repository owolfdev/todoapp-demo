import React, { useEffect } from "react";
import Layout from "../components/Layout";
import TodoList from "../components/TodoList";
import AGGrid from "../components/AGGrid";
import AGGridApproved from "../components/AGGrid_approved";
import Link from "next/link";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const allowedEmails = [
  "oliverwolfson@gmail.com",
  "owolfdev@gmail.com",
  "air.puthita@gmail.com",
  "silomsoi8.air@gmail.com",
];

const Home: React.FC = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    // if (!session) {
    //   router.push("/signin");
    // }
  }, [session]);

  return (
    <div>
      <div>
        <AGGrid path="/" />
      </div>
      <div className="mt-5">
        <h1 className="mb-4 text-4xl font-bold">Approved Todos</h1>
        <AGGridApproved path="/approved" />
      </div>
    </div>
  );
};

export default Home;
