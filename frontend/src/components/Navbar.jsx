import { Link, useNavigate } from 'react-router-dom';
import { Activity, UserRound, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const { token, logoutDoctor } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutDoctor();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
          <Activity className="w-8 h-8" />
          <span>Doctorz</span>
        </Link>
        
        <div>
          {token ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/doctor/dashboard" 
                className="text-slate-600 hover:text-primary font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/doctor/login" 
              className="flex items-center gap-2 text-slate-500 hover:text-primary font-medium transition-colors"
            >
              <UserRound className="w-5 h-5" />
              <span className="hidden sm:inline">Doctor Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
