import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequireAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);
}
