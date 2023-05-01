import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

// const FormSchema = z.object({
//   email: z.string().email(),
// });

// type FormSchemaType = z.infer<typeof FormSchema>;

const allowedEmails = [
  "oliverwolfson@gmail.com",
  "owolfdev@gmail.com",
  "air.puthita@gmail.com",
  "silomsoi8.air@gmail.com",
];

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (session?.user && session.user.email) {
      if (allowedEmails.includes(session.user.email)) {
        //console.log("Authorized email:", session.user.email);
        //router.push("/signin"); // Redirect to /signin after successful login
        router.push("/");
      } else {
        console.error("Unauthorized email:", session.user.email);
        signOut();
      }
    }
  }, [session]);

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/"); // Redirect to a different page after signing out (e.g., home page)
    }
  }

  return (
    <div className="flex flex-col">
      <>
        <h2 className="mb-4 text-2xl font-bold">
          {!session ? `Sign In` : `Sign Out, or Sign In as Another User`}
        </h2>
        <p className="mb-4">
          This is a private todo list. Please sign in with your Google account
          to continue.
        </p>
        <div className="mb-4">
          {session && (
            <div>
              You are signed in as{" "}
              <span className="font-bold">{session?.user.email}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-full px-8 py-4 mb-2 text-xl font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          //   disabled={isSubmitting}
          onClick={signInWithGoogle}
          title="Sign in with your Google account."
        >
          Sign in with Google &nbsp;
          <div className="rounded">
            <FcGoogle size={24} />
          </div>
        </button>
        {session && (
          <button
            type="button"
            className="py-4 text-xl font-semibold text-gray-700 bg-red-100 rounded-lg hover:bg-red-200"
            onClick={signOut}
          >
            Sign out
          </button>
        )}
      </>
    </div>
  );
};

export default SignIn;
