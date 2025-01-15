import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import ThankYouGift from './pages/ThankYouGift';
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CancelSubscription from './pages/CancelSubscription';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "faq", element: <FAQ /> },
      { path: "contact", element: <Contact /> },
      { path: "checkout", element: <Checkout /> },
      { path: "thank-you", element: <ThankYou /> },
      { path: "thank-you-gift", element: <ThankYouGift /> },
      { path: "pricing", element: <Pricing /> },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
      { path: "cancel-subscription", element: <CancelSubscription /> }
    ]
  }
]);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);