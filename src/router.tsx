
import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import BuyerDashboard from './pages/BuyerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import RFQForm from './pages/RFQForm';
import BuyerBidReview from './pages/BuyerBidReview';
import BuyerPOList from './pages/BuyerPOList';
import App from './App';


const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/test', element: <App /> },

  { path: '/buyer', element: <BuyerDashboard /> },
  { path: '/vendor', element: <VendorDashboard /> },
  { path: '/buyer/rfq', element: <RFQForm /> }, // 👈 new route
  { path: '/buyer/rfq/:id/bids', element: <BuyerBidReview /> }, // ✅ new route
  { path: '/buyer/po-list', element: <BuyerPOList /> }, // ✅ new route


]
,
  {
    basename: '/frontend-react', // 👈 ADD THIS
  }
);

export default router;
