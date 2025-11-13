import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'

// Debug mode: if URL has ?debug=1, pre-populate localStorage so you can skip login and jump to dashboard
(function enableDebugModeIfRequested() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') {
      // small debug user: profissional
      const debugUser = {
        name: 'debug.user',
        role: 'profissional',
        profissionalId: 'debug@local'
      };
      localStorage.setItem('user', JSON.stringify(debugUser));
      localStorage.setItem('token', 'debug-token');
      // replace URL path to dashboard (remove query) without reloading
      window.history.replaceState(null, '', '/dashboard');
    }
  } catch (e) {
    // ignore
    console.warn('Debug init failed', e);
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
