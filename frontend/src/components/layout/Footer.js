import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-muted py-3 mt-5 border-top text-light">
      <div className="container">
        <small>© {new Date().getFullYear()} Tecnovision · Todos los derechos reservados</small>
      </div>
    </footer>
  );
};

export default Footer;
