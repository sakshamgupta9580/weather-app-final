import { memo } from 'react';
import logo from '../../../assets/icons/logo.svg';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={logo} width="24" height="24" alt="" />
          <span>Skycast</span>
        </div>
        <p className="footer__note">
          Weather data by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
        </p>
        <p className="footer__copy">© {year} Skycast · Built with React &amp; Vite</p>
      </div>
    </footer>
  );
}

export default memo(Footer);
