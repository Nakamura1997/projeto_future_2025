// components/RelatorioIntroducao.tsx
import Image from "next/image";
import nistLogo from "@/assets/logo_nist.png"; // substitua com o caminho correto da imagem
import { useEffect, useState } from "react";

export default function RelatorioIntroducao({
  base64Images,
}: {
  base64Images: { [key: string]: string };
}) {
  const [clienteName, setClienteName] = useState<string | null>(null);

  useEffect(() => {
    // Buscar o nome do cliente do localStorage
    const form = JSON.parse(
      localStorage.getItem("formularioAnaliseCompleto") || "{}"
    );
    const name = form.nome_cliente;
    if (name) {
      setClienteName(name);
    }
  }, []);

  const nistImageSrc = base64Images?.nistLogo;

  return (
    <div className="introducao report-section ">
      <h4>Introdução</h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p className="justify">
            A Estrutura de Segurança Cibernética (CSF) 2.0 do NIST fornece
            orientação ao setor, aos órgãos governamentais e a outras
            organizações para gerenciar os riscos de segurança cibernética.
          </p>
          <p className="justify">
            Ela oferece uma taxonomia de resultados de segurança cibernética de
            alto nível que pode ser usada por qualquer organização
            independentemente de seu tamanho, setor ou maturidade para entender,
            avaliar, priorizar e comunicar melhor seus esforços de segurança
            cibernética.
          </p>
        </div>

        {nistImageSrc ? (
          <img
            src={nistImageSrc}
            alt="NIST Logo"
            data-img-key="nistLogo"
            style={{
              maxWidth: "210px",
              maxHeight: "210px",
              objectFit: "contain",
              display: "block",
              marginRight: "16px",
              marginBottom: "12px",
            }}
          />
        ) : (
          <Image
            src={nistLogo}
            alt="NIST Logo"
            width={210}
            height={210}
            className="logo-report"
            data-img-key="nistLogo"
          />
        )}
      </div>
      <div>
        <p className="justify">
          O NIST CSF 2.0 é um guia completo e flexível que auxilia organizações
          de qualquer porte ou setor a gerenciar e reduzir seus riscos de
          segurança cibernética. Ele oferece uma estrutura padronizada para
          entender, avaliar e aprimorar a postura de segurança cibernética de
          uma organização, promovendo a comunicação e a colaboração entre as
          partes interessadas.
        </p>{" "}
      </div>
      <h3 className="h3">Como o NIST CSF 2.0 funciona?</h3>
      <br />
      <ul>
        <li className="justify">
          <strong>Identificar:</strong> Compreender o ambiente, os sistemas,
          ativos, dados e capacidades da organização relacionados à segurança
          cibernética..
        </li>
        <li className="justify">
          <strong>Proteger:</strong> Implementar salvaguardas para garantir a
          continuidade dos serviços críticos, como controles de acesso,
          criptografia e gerenciamento de vulnerabilidades.
        </li>
        <li className="justify">
          <strong>Detectar:</strong> Identificar eventos de segurança
          cibernética por meio de monitoramento contínuo, detecção de intrusões
          e análise de logs.{" "}
        </li>
        <li className="justify">
          <strong>Responder:</strong> Desenvolver e implementar ações para lidar
          com eventos de segurança cibernética, como contenção, erradicação e
          recuperação de dados.{" "}
        </li>
        <li className="justify">
          <strong>Recuperar:</strong> Restaurar serviços e capacidades afetados
          por um incidente de segurança cibernética, incluindo planos de
          recuperação de desastres e continuidade de negócios.{" "}
        </li>
      </ul>
      <br />

      <p>
        Além disso, o NIST CSF 2.0 introduziu a função Governar, que destaca a
        importância da liderança e da tomada de decisões estratégicas na
        segurança cibernética. Isso inclui:
      </p>
      <ul>
        <li className="justify">
          <strong>Definir prioridades:</strong> Identificar ativos críticos,
          ameaças relevantes e riscos prioritários.
        </li>
        <li className="justify">
          <strong>Estabelecer estruturas de gerenciamento de riscos:</strong>{" "}
          Criar processos e responsabilidades para lidar com os riscos de
          segurança cibernética.
        </li>
        <li className="justify">
          <strong>Promover uma cultura de segurança cibernética:</strong>{" "}
          Conscientizar e treinar colaboradores, incentivando a responsabilidade
          compartilhada pela segurança.
        </li>
        <li className="justify">
          <strong>Supervisionar e avaliar:</strong> Monitorar a eficácia das
          práticas de segurança cibernética e realizar ajustes quando
          necessário.
        </li>
      </ul>

      <h3 className="h3">Benefícios do NIST CSF 2.0:</h3>
      <br />
      <ul>
        <li className="justify">
          Redução de riscos: Minimiza a probabilidade e o impacto de incidentes
          de segurança cibernética.
        </li>
        <li className="justify">
          Comunicação e colaboração: Facilita o diálogo sobre segurança
          cibernética entre as partes interessadas.
        </li>
        <li className="justify">
          Conformidade regulatória: Auxilia no atendimento a requisitos de
          conformidade, como a LGPD.
        </li>
        <li className="justify">
          Confiança das partes interessadas: Demonstra o compromisso da
          organização com a segurança cibernética.
        </li>
        <li className="justify">
          Resiliência cibernética: Fortalece a capacidade da organização de se
          preparar, responder e se recuperar de incidentes.
        </li>
      </ul>

      {/* Avaliação de maturidade */}
      <p className="justify">
        O NIST CSF 2.0 é um recurso valioso para qualquer organização que busca
        fortalecer sua postura de segurança cibernética. Ele oferece uma
        abordagem abrangente e adaptável para gerenciar riscos, otimizar
        recursos e proteger ativos críticos.{" "}
      </p>
      <p className="justify">
        Na avaliação de maturidade proposta neste documento, foram capturados os
        níveis de cada medida de controle conforme os níveis de maturidade
        estabelecidos na tabela a seguir.
      </p>
      <p className="justify">
        Na avaliação de maturidade proposta neste documento, foram capturados os
        níveis de cada medida de controle conforme os níveis de maturidade
        estabelecidos na tabela a seguir.{" "}
      </p>

      <p>
        A meta é que a organização atinja pelo menos o{" "}
        <strong>nível de maturidade 3</strong> — definido tanto para Política
        quanto para Prática.
      </p>
    </div>
  );
}
