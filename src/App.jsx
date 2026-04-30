import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { supabase } from "../superbaseClient";

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            textTransform: "capitalize",
          },
        }}
      />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
