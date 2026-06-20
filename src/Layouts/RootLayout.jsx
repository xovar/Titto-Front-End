import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Shared/Navbar';
import Footer from '../Components/Shared/Footer';

export default function RootLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {/* Active sub-routes will render here */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}