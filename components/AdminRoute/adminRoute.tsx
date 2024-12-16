import { useRouter } from "next/router";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const router = useRouter();

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined" || !localStorage) {
      return "";
    }
    return window.localStorage.getItem(key);
  };

  const token = getFromLocalStorage("token");
  const currentUser: any = token ? jwtDecode(token) : null;

  useEffect(() => {
    // if (!currentUser || currentUser.role !== 1) {
    if (!currentUser) {
      router.push("/"); // Redirect to homepage or any other page for non-admin users
    }
  }, [currentUser, router]);

  return <>{children}</>;
};

export default AdminRoute;
