import supabase from "@/utils/supabase";
import Router from "next/router";
import { useEffect } from "react";

export default function signout() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();

    Router.push("/auth");
  };

  useEffect(() => {
    handleSignOut();
  }, []);

  return <div>Loggin you out...</div>;
}
