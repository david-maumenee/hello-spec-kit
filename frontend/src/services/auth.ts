import { api } from './api';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthStateListener = (state: AuthState) => void;

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };

  private listeners: Set<AuthStateListener> = new Set();

  subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): AuthState {
    return this.state;
  }

  async register(email: string, password: string): Promise<void> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    api.setAccessToken(response.accessToken);
    this.setState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
      rememberMe,
    });
    api.setAccessToken(response.accessToken);
    this.setState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      api.setAccessToken(null);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  async refresh(): Promise<boolean> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      api.setAccessToken(response.accessToken);
      this.setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch {
      api.setAccessToken(null);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  async initialize(): Promise<void> {
    this.setState({ isLoading: true });
    await this.refresh();
  }
}

export const authService = new AuthService();
