import { useEffect, useState } from "react";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/admin/Login";
import ServiceSelection from "./pages/client/ServiceSelection";
import { ClientCalendar } from "./pages/client/Calendar";
import TimeSelection from "./pages/client/TimeSelection";
import ClientConfirmation from "./pages/client/Confirmation";

type Route =
  | "/"
  | "/admin/login"
  | "/client/service"
  | "/client/calendar"
  | "/client/time"
  | "/client/confirm";

function safePath(): Route {
  const p = window.location.pathname || "/";
  if (p === "/admin/login") return "/admin/login";
  if (p === "/client/service") return "/client/service";
  if (p === "/client/calendar") return "/client/calendar";
  if (p === "/client/time") return "/client/time";
  if (p === "/client/confirm") return "/client/confirm";
  return "/";
}

export default function App() {
  const [path, setPath] = useState<Route>(safePath());

  useEffect(() => {
    const onPop = () => setPath(safePath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(to: Route) {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }

  const router = { push: (p: string) => go(p as Route) };

  return (
    <Layout>
      {path === "/" && <Landing />}
      {path === "/admin/login" && <Login />}
      {path === "/client/service" && <ServiceSelection router={router} />}
      {path === "/client/calendar" && <ClientCalendar router={router} />}
      {path === "/client/time" && <TimeSelection router={router} />}
      {path === "/client/confirm" && <ClientConfirmation router={router} />}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button onClick={() => go("/")} className="px-3 py-2 bg-white text-black rounded">Landing</button>
        <button onClick={() => go("/admin/login")} className="px-3 py-2 bg-white text-black rounded">Admin</button>
        <button onClick={() => go("/client/service")} className="px-3 py-2 bg-white text-black rounded">Cliente</button>
      </div>
    </Layout>
  );
}
