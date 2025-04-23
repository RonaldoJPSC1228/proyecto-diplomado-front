import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AutoLogoutWrapper from "./components/auth/autoLogoutWrapper";

import AdminRoute from "./components/admin/adminRoute";
import Dashboard from "./pages/dashboard";
import Products from "./components/admin/products";
import CreateProduct from "./components/admin/createProducts";
import DetailProduct from "./components/admin/detailProduct";

import PrivateRoute from "./components/auth/privateRoute";
import Cart from "./pages/cart";

import NotFound from "./pages/notFound";

function App() {
  return (
    <Router>
      <AutoLogoutWrapper />

      <div className="d-flex flex-column min-vh-100">
        {/* Navbar siempre visible */}
        <Navbar />

        {/* El main ocupa el espacio restante y asegura que el footer esté abajo */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/products"
              element={
                <AdminRoute>
                  <Products />
                </AdminRoute>
              }
            />

            <Route
              path="/products/create"
              element={
                <AdminRoute>
                  <CreateProduct />
                </AdminRoute>
              }
            />

            <Route
              path="/products/:id"
              element={
                <AdminRoute>
                  <DetailProduct />
                </AdminRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Footer siempre en la parte inferior */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
