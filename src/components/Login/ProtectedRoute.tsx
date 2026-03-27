import { Navigate } from 'react-router-dom';

// Функция для получения куки по имени
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Замените 'session_id' или 'token' на имя вашей куки
  const isAuthenticated = getCookie('session_id'); 

  if (!isAuthenticated) {
    // Если куки нет, отправляем на страницу логина
    return <Navigate to="/" replace />;
  }

  // Если кука есть, рендерим дочерний компонент (MainPage)
  return <>{children}</>;
};