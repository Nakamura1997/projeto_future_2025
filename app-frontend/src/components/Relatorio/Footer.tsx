import Image from "next/image";

import logo from "@/assets/LogoFutureHorizontal.png";
type FooterProps = {
  pageNumber: number;
  totalPages: number;
};

export const Footer = ({ pageNumber, totalPages }: FooterProps) => {
  return (
    // A classe 'page-footer' será usada no CSS de impressão
    <div className="page-footer">
      <div className="footer-logo">
        {/* Usamos um caminho relativo e um atributo de dados para identificar o logo */}
        <Image
          src={logo}
          alt="Logo"
          className="logo-no-footer"
          data-img-key="footerLogo"
        />
      </div>
      <div className="footer-text">
        Nota Técnica – Avaliação NIST – Cyber Security Framework – Versão 2.0
      </div>
      <div className="footer-page-number">
        Página {pageNumber} de {totalPages}
      </div>
    </div>
  );
};
