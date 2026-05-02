import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

// Components
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Public Pages
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
import AdminFinancialReport from "@/pages/admin/financial-report";
import AdminDataManagement from "@/pages/admin/data-management";

function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <AdminLogin />;
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
      <Route path="/admin" component={() => <ProtectedAdminRoute component={AdminDashboard} />} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={() => <ProtectedAdminRoute component={AdminDashboard} />} />
      <Route path="/admin/orders" component={() => <ProtectedAdminRoute component={AdminOrders} />} />
      <Route path="/admin/products" component={() => <ProtectedAdminRoute component={AdminProducts} />} />
      <Route path="/admin/customers" component={() => <ProtectedAdminRoute component={AdminCustomers} />} />
      <Route path="/admin/website-editor" component={() => <ProtectedAdminRoute component={AdminWebsiteEditor} />} />
      <Route path="/admin/analytics" component={() => <ProtectedAdminRoute component={AdminAnalytics} />} />
      <Route path="/admin/settings" component={() => <ProtectedAdminRoute component={AdminSettings} />} />
      <Route path="/admin/financial-report" component={() => <ProtectedAdminRoute component={AdminFinancialReport} />} />
      <Route path="/admin/data-management" component={() => <ProtectedAdminRoute component={AdminDataManagement} />} />

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
          <OrderProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
              <SonnerToaster position="top-right" richColors />
            </TooltipProvider>
          </OrderProvider>
        </CartProvider>
      </AdminAuthProvider>
    </SiteConfigProvider>
  );
}

export default App;
