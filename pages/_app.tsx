import "@/styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Layout title="Todos">
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
