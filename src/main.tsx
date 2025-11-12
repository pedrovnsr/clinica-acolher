import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'

const rootEl = document.getElementById("root")!;

// Global error handler: escreve a mensagem no DOM para evitar tela-branca silenciosa
window.addEventListener('error', (ev: ErrorEvent) => {
  try {
    const pre = document.createElement('pre');
    pre.style.color = '#b00020';
    pre.style.padding = '12px';
    pre.style.background = '#fff3f3';
    pre.textContent = `Runtime error: ${ev.message} at ${ev.filename}:${ev.lineno}:${ev.colno}`;
    rootEl.appendChild(pre);
  } catch (error) {
    // log to console if append fails
    console.error('error handling runtime error', error);
  }
});

window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
  try {
    const pre = document.createElement('pre');
    pre.style.color = '#b00020';
    pre.style.padding = '12px';
    pre.style.background = '#fff3f3';
    pre.textContent = `UnhandledRejection: ${String(ev.reason)}`;
    rootEl.appendChild(pre);
  } catch (error) {
    console.error('error handling unhandledrejection', error);
  }
});

console.log('main start');

ReactDOM.createRoot(rootEl).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
