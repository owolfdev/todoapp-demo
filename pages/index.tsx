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
    if (!session) {
      router.push("/signin");
    }
    // if (session?.user && session.user.email) {
    //   if (allowedEmails.includes(session.user.email)) {
    //     //console.log("Authorized email:", session.user.email);
    //     //router.push("/signin"); // Redirect to /signin after successful login
    //   } else {
    //     //console.error("Unauthorized email:", session.user.email);
    //     signOut();
    //   }
    // }
  }, [session]);

  // async function signOut() {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error("Error signing out:", error.message);
  //   } else {
  //     //router.push("/signin"); // Redirect to a different page after signing out (e.g., home page)
  //   }
  // }
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
