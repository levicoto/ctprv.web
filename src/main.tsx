import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider } from './lib/i18n.tsx';
import './index.css';

interface BoundaryProps {
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

class RootErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Root render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0F1C] text-[#E2E8F0] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl glass-panel p-6 text-center space-y-4">
            <p className="text-sm font-light text-[#94A3B8]">
              No fue posible inicializar la interfaz en este navegador.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl btn-platinum text-xs font-medium cursor-pointer transition-colors"
            >
              Recargar interfaz
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </RootErrorBoundary>
  );
}
