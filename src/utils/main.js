export function getElectronModule (moduleKey) {
  if (moduleKey in window && typeof window.require === 'function') {
    return window.require('electron')[moduleKey];
  } else if (window[moduleKey]) {
    return window[moduleKey];
  }else {
    return null;
  }
};
