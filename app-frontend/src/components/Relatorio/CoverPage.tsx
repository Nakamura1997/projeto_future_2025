// components/Relatorio/CoverPage.tsx
import Image from "next/image";
import logoReport from "@/assets/Imagem1.png";

const CoverPage = ({
  base64Images,
}: {
  base64Images: { [key: string]: string };
}) => {
  const imageSrc = base64Images?.logoReport;

  return (
    <div className="coverContainer">
      <div className="header"></div>
      <br />
      <br />
      <div className="titleSection">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Company Logo"
            width={450}
            height={300}
            className="logo-report"
            data-img-key="logoReport"
          />
        ) : (
          <Image
            src={logoReport}
            alt="Company Logo"
            width={450}
            height={300}
            className="logo-report"
            data-img-key="logoReport"
          />
        )}

        <div className="subtitulo-capa">
          <p className="mainTitle">
            NOTA TÉCNICA AVALIAÇÃO DE MATURIDADE CORPORATIVO
          </p>
          <p className="subtitle">NIST CYBERSECURITY FRAMEWORK</p>
        </div>
      </div>

      <div className="footer-capa">
        <p className="date">
          {new Date()
            .toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })
            .toUpperCase()}
        </p>
        <p className="version">VERSAO 1.0</p>
      </div>
    </div>
  );
};

export default CoverPage;
