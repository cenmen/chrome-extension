import React from 'react';
import ReactDOM from 'react-dom/client';
import Color from './views/Color';

setTimeout(() => {
  const selectors = document.querySelectorAll('.growing-title');
  selectors.forEach(item => {
    const div = document.createElement('div');
    div.id = 'extension';
    item.appendChild(div);
    ReactDOM.createRoot(div).render(<Color />);
  });
}, 5000);
