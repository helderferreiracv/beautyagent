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

function getHashRoute(): Route {
  const raw = (window.location.hash || "#/").replace("#", "");
  if (raw === "/admin/login") return "/admin/login";
  if (raw === "/client/service") return "/client/service";
  if (raw === "/client/calendar") return "/client/calendar";
  if (raw === "/client/time") return "/client/time";
  if (raw === "/client/confirm") return "/client/confirm";
  return "/";
}

export default function App() {
  const [route, setRoute] = useState<Route>(getHashRoute());

  useEffect(() => {
    const onHash = () => setRoute(getHashRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function go(to: Route) {
    window.location.hash = to === "/" ? "#/" : `#${to}`;
    window.scrollTo(0, 0);
  }

  const router = { push: (p: string) => go(p as Route) };

  return (
    <Layout>
      {route === "/" && <Landing />}
      {route === "/admin/login" && <Login />}
      {route === "/client/service" && <ServiceSelection router={router} />}
      {route === "/client/calendar" && <ClientCalendar router={router} />}
      {route === "/client/time" && <TimeSelection router={router} />}
      {route === "/client/confirm" && <ClientConfirmation router={router} />}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button onClick={() => go("/")} className="px-3 py-2 bg-white text-black rounded">
          Landing
        </button>
        <button onClick={() => go("/admin/login")} className="px-3 py-2 bg-white text-black rounded">
          Admin
        </button>
        <button onClick={() => go("/client/service")} className="px-3 py-2 bg-white text-black rounded">
          Cliente
        </button>
      </div>
    </Layout>
  );
}
