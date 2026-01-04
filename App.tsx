import React, { createContext, useContext, useEffect, useState } from "react";
import { Providers } from "./app/providers";
import { Layout } from "./components/Layout";

// Pages
import Landing from "./pages/Landing";
import { ClientServiceSelection } from "./pages/client/ServiceSelection";
import { ClientCalendar } from "./pages/client/Calendar";
import { ClientTimeSelection } from "./pages/client/TimeSelection";
import { ClientConfirmation } from "./pages/client/Confirmation";
import { MyBookings } from "./pages/client/MyBookings";
import { OwnerDashboard } from "./pages/owner/Dashboard";
import { OwnerAgenda } from "./pages/owner/Agenda";
import { AdminGlobal } from "./pages/admin/Global";
import { TrialRegister } from "./pages/trial/TrialRegister";

type RouterValue = {
  pathname: string;
  push: (path: string) => void;
  back: () => void;
};

const RouterContext = createContext<RouterValue>({
  pathname: "/",
  push: () => {},
  back: () => {}
});

export const useRouter = () => useContext(RouterContext);
export const usePathname = () => useContext(RouterContext).pathname;

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname || "/");

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname || "/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setPathname(path);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (pathname.includes("/client/service")) return <ClientServiceSelection />;
    if (pathname.includes("/client/calendar")) return <ClientCalendar />;
    if (pathname.includes("/client/time")) return <ClientTimeSelection />;
    if (pathname.includes("/client/confirm")) return <ClientConfirmation />;
    if (pathname.includes("/client/my-bookings")) return <MyBookings />;

    if (pathname.includes("/owner/dashboard")) return <OwnerDashboard />;
    if (pathname.includes("/owner/agenda")) return <OwnerAgenda />;

    if (pathname.includes("/admin/global")) return <AdminGlobal />;

    if (pathname.includes("/trial/register")) return <TrialRegister />;

    return <Landing />;
  };

  return (
    <RouterContext.Provider value={{ pathname, push: navigate, back: () => window.history.back() }}>
      <Providers>
        <Layout>{renderPage()}</Layout>
      </Providers>
    </RouterContext.Provider>
  );
}
