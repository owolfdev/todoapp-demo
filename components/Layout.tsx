import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { IoIosHelpCircle } from "react-icons/io";
import { useRouter } from "next/router";
import supabase from "@/lib/supabaseClient";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import ModalSignOut from "@/components/ModalSignout";
// import { useAuthStateChange } from "@supabase/supabase-js";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const allowedEmails = [
  "oliverwolfson@gmail.com",
  "owolfdev@gmail.com",
  "air.puthita@gmail.com",
  "silomsoi8.air@gmail.com",
];

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const router = useRouter();
  const user = useUser();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [showModal, setShowModal] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthInitialized(true);
    });

    // Clean up the listener when the component is unmounted
    // return () => {
    //   supabase.auth.onAuthStateChange((event, session) => {
    //     setIsAuthInitialized(false);
    //   });
    // };
  }, []);

  useEffect(() => {
    if (!isAuthInitialized) return;

    if (!session) {
      router.push("/signin");
    }

    if (session?.user && session.user.email) {
      if (allowedEmails.includes(session.user.email)) {
      } else {
        console.error("Unauthorized email:", session.user.email);
        signOut();
      }
    }
  }, [session, isAuthInitialized]);

  async function signOut() {
    console.log("Signing out...");

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/signin");
    }
  }

  function handleSignOutButtonClick() {
    setShowModal(true);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container px-4 mx-auto">
        <nav className="flex items-end py-8 space-x-5">
          <Link href="/">
            <h1 className="text-5xl font-bold">{title}</h1>
          </Link>
          <div className="hover:text-gray-500">
            <Link href="/add-todo">Add Todo</Link>
          </div>
          <div className="hover:text-gray-500">
            {session ? (
              <button onClick={handleSignOutButtonClick}>Sign Out</button>
            ) : (
              <Link href="/signin">Sign In</Link>
            )}
          </div>
          <div className="flex text-2xl hover:text-gray-500">
            <button onClick={() => router.push("/docs")}>
              <IoIosHelpCircle />
            </button>
          </div>
        </nav>
        <main className="mb-8">{children}</main>
      </div>
      {showModal && (
        <ModalSignOut
          setShowModal={setShowModal}
          theFunction={signOut}
          message="Are you sure you want to sign out?"
          label="Sign Out"
          path="/signin"
        />
      )}
    </>
  );
};

export default Layout;

// // Import React and necessary components
// import React, { useEffect } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { IoIosHelpCircle } from "react-icons/io";
// import { useRouter } from "next/router";
// //import { useSession } from "@supabase/auth-helpers-react";
// import supabase from "@/lib/supabaseClient";
// import {
//   useSession,
//   useSupabaseClient,
//   useUser,
// } from "@supabase/auth-helpers-react";
// import Modal from "@/components/ModalSignout";

// interface LayoutProps {
//   title?: string;
//   children: React.ReactNode;
// }

// const allowedEmails = [
//   "oliverwolfson@gmail.com",
//   "owolfdev@gmail.com",
//   "air.puthita@gmail.com",
//   "silomsoi8.air@gmail.com",
// ];

// const Layout: React.FC<LayoutProps> = ({ title, children }) => {
//   const router = useRouter();
//   //const router = useRouter();
//   const user = useUser();
//   const session = useSession();
//   const supabase = useSupabaseClient();

//   useEffect(() => {
//     if (!session) {
//       router.push("/signin");
//     }

//     if (session?.user && session.user.email) {
//       if (allowedEmails.includes(session.user.email)) {
//         //console.log("Authorized email:", session.user.email);
//         //router.push("/signin"); // Redirect to /signin after successful login
//       } else {
//         console.error("Unauthorized email:", session.user.email);
//         signOut();
//       }
//     }
//   }, [session]);

//   async function signOut() {
//     console.log("Signing out...");

//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error signing out:", error.message);
//     } else {
//       //router.push("/signin"); // Redirect to a different page after signing out (e.g., home page)
//     }
//   }

//   async function handleSignOut() {
//     console.log("handle sign out...");

//     signOut();
//   }

//   return (
//     <>
//       <Head>
//         <title>{title}</title>
//         <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//         <meta charSet="utf-8" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className="container px-4 mx-auto">
//         <nav className="flex items-end py-8 space-x-5">
//           <Link href="/">
//             <h1 className="text-5xl font-bold">{title}</h1>
//           </Link>
//           <div className="hover:text-gray-500">
//             <Link href="/add-todo">Add Todo</Link>
//           </div>
//           <div className="hover:text-gray-500">
//             {session ? (
//               <button onClick={handleSignOut}>Sign Out</button>
//             ) : (
//               <Link href="/signin">Sign In</Link>
//             )}
//           </div>
//           <div className="flex text-2xl hover:text-gray-500">
//             <button onClick={() => router.push("/docs")}>
//               <IoIosHelpCircle />
//             </button>
//           </div>
//         </nav>
//         <main className="mb-8">{children}</main>
//       </div>
//     </>
//   );
// };

// export default Layout;
