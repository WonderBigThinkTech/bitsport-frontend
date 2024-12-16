import { useRouter } from 'next/router';
import { useEffect } from 'react';
import jwtDecode from "jwt-decode";

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
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
    if (!currentUser || currentUser.role === 1) {
      router.push('/'); // Redirect to homepage or any other page for non-admin users
    }
  }, [currentUser, router]);

  return <>{children}</>;
};

export default UserRoute;
