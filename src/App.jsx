import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import GuardRoute from "./template/components/GuardRoute";
import ProtectedRoute from "./template/components/ProtectedRoute";
import AccountCode from "./views/accounts/AccountCode";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route
          exact
          path="/auth/login"
          element={
            <GuardRoute>
              <Login />
            </GuardRoute>
          }
        />
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/account-codes"
          element={
            <ProtectedRoute>
              <AccountCode />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
