import React from 'react';

// Simple toast implementation for the app
let toastContainer: HTMLDivElement | null = null;

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const getOrCreateToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '16px';
    toastContainer.style.right = '16px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
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
    max-width: 300px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    pointer-events: auto;
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

// Export toast function that mimics sonner API
export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
};

// Make toast available globally for the components that import from sonner
if (typeof window !== 'undefined') {
  (window as any).toast = toast;
}