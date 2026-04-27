import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isMockSupabase } from './lib/supabase';
import LivingRoom from './components/LivingRoom';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isMockSupabase) {
        if (!localStorage.getItem('toca_user')) {
          navigate('/login');
        }
        setLoading(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) return null;

  return (
    <LivingRoom />
  );
}

export default App;
