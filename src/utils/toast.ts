// Toast utility to replace sonner imports
let toastContainer: HTMLDivElement | null = null;

const getOrCreateToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      pointer-events: none;
      max-width: 400px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window === 'undefined') return; // SSR safety
  
  const container = getOrCreateToastContainer();
  const id = Math.random().toString(36).substr(2, 9);
  
  const toast = document.createElement('div');
  toast.id = `toast-${id}`;
  toast.innerHTML = message;
  toast.style.cssText = `
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    max-width: 350px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    word-wrap: break-word;
    line-height: 1.4;
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

// Export toast function that mimics sonner API
export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
};

// Make it the default export as well
export default toast;