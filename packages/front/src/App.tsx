import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Browse from './pages/Browse';
import Profile from './pages/profile/Profile';
import ProfileView from './pages/ProfileView';
import Chat from './pages/Chat';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import { VerifyEmail } from './pages/VerifyEmail';
import { useAuthStore } from './store/authStore';
import CreateNewPassword from './pages/CreateNewPassword';
import './api/socket.api';
import { useQueryClient } from '@tanstack/react-query';
import { SocketEvents } from '../../shared/socket-events';
import { QUERY_KEYS } from './utils/utils';
import { connectSocket } from './api/socket.api';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

export const IS_LOGGED_IN_KEY = 'isLoggedIn';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn || localStorage.getItem(IS_LOGGED_IN_KEY) ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const RedirectToDashboard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return !isLoggedIn && !localStorage.getItem(IS_LOGGED_IN_KEY) ? (
    <>{children}</>
  ) : (
    <Navigate to="/browse" replace />
  );
};

const App = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME], exact: true });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BROWSE_USERS],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.NOTIFICATIONS],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_CHANNELS],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_USERS_PROFILE_LIST],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.VIEW_USER],
      exact: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn || localStorage.getItem(IS_LOGGED_IN_KEY)) {
      const socket = connectSocket();

      socket?.on(SocketEvents.USER_CONNECTED, () => {
        invalidateAllQueries();
      });

      socket?.on(SocketEvents.USER_INTERACTION_ADDED, () => {
        invalidateAllQueries();
      });

      socket?.on(SocketEvents.USER_DISCONNECTED, () => {
        invalidateAllQueries();
      });

      socket?.on(SocketEvents.RECEIVE_MESSAGE, () => {
        invalidateAllQueries();
      });
      socket?.on(SocketEvents.NOTIFICATION_READ, () => {
        invalidateAllQueries();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route
            path="/login"
            element={
              <RedirectToDashboard>
                <Login />
              </RedirectToDashboard>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectToDashboard>
                <Register />
              </RedirectToDashboard>
            }
          />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/new-password/:token" element={<CreateNewPassword />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectToDashboard>
                <ForgotPassword />
              </RedirectToDashboard>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
