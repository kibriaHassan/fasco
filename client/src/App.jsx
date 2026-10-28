import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToHash from './components/ScrollToHash';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import NewPassword from './pages/NewPassword';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ThankYou from './pages/ThankYou';
import VerifyOtp from './pages/VerifyOtp';

const AUTH_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/verify-otp', '/new-password'];

function App() {
  const { pathname } = useLocation();
  const isAuth = AUTH_PATHS.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
      {!isAuth && <Footer />}
    </div>
  );
}

export default App;
