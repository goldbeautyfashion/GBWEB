import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

// Components
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Pages
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import TrackOrder from "@/pages/track-order";
import About from "@/pages/about";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminProducts from "@/pages/admin/products";
import AdminCustomers from "@/pages/admin/customers";
import AdminWebsiteEditor from "@/pages/admin/website-editor";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSettings from "@/pages/admin/settings";

function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedAdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <ProtectedAdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/orders">
        <ProtectedAdminRoute component={AdminOrders} />
      </Route>
      <Route path="/admin/products">
        <ProtectedAdminRoute component={AdminProducts} />
      </Route>
      <Route path="/admin/customers">
        <ProtectedAdminRoute component={AdminCustomers} />
      </Route>
      <Route path="/admin/website-editor">
        <ProtectedAdminRoute component={AdminWebsiteEditor} />
      </Route>
      <Route path="/admin/analytics">
        <ProtectedAdminRoute component={AdminAnalytics} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedAdminRoute component={AdminSettings} />
      </Route>

      {/* Public Store Routes */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/shop" component={Shop} />
            <Route path="/product/:id" component={ProductDetail} />
            <Route path="/cart" component={Cart} />
            <Route path="/track-order" component={TrackOrder} />
            <Route path="/about" component={About} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <SiteConfigProvider>
      <AdminAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AdminAuthProvider>
    </SiteConfigProvider>
  );
}

export default App;
