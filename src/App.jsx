import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import GuardRoute from "./template/components/GuardRoute";
import ProtectedRoute from "./template/components/ProtectedRoute";

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {routes.guest.map((pg, i) => (
          <Route
            exact
            key={i}
            path={pg.url}
            element={<GuardRoute>{pg.element}</GuardRoute>}
          />
        ))}
        {routes.protected.map((pg, i) => (
          <Route
            exact
            key={i}
            path={pg.url}
            element={<ProtectedRoute>{pg.element}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default App;
