import supabase from "@/utils/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function admin() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  return <div>Admin Panel</div>;
}
