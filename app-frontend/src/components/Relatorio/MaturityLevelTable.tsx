// components/Relatorio/MaturityLevelTable.tsx
import React from "react";

type MaturityLevelTableProps = {
  isEditing: boolean;
};

const MaturityLevelTable: React.FC<MaturityLevelTableProps> = ({
  isEditing,
}) => {
  const tableTitleRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (tableTitleRef.current && !tableTitleRef.current.innerHTML) {
      tableTitleRef.current.innerHTML = `Tabela de Níveis de Maturidade`;
    }
  }, []);

  return (
    <div className="report-section table-niveis">
      <h3
        ref={tableTitleRef}
        className={` h3 editable-title ${isEditing ? "editing" : ""}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
      <br />
      <table className="maturity-table">
        <thead>
          <tr>
            <th>Nível </th>
            <th>Expectativa da Política </th>
            <th>Expectativa da Prática </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 - Inicial </td>
            <td>
              A política ou o padrão NÃO existe ou NÃO é formalmente aprovada
              pela organização.{" "}
            </td>
            <td>O processo padrão e, portanto, a prática NÃO existe. </td>
          </tr>
          <tr>
            <td>2 - Repetido </td>
            <td>
              A política ou o padrão existe, mas ele NÃO é revisado há mais de 2
              anos.{" "}
            </td>
            <td>O processo existe, mas ele é executado informalmente. </td>
          </tr>
          <tr>
            <td>3 - Definido </td>
            <td>
              A política e o padrão existem com aprovação formal da organização.
              Exceções à Política são documentadas e aprovadas e ocorrem menos
              de 5% do tempo.{" "}
            </td>
            <td>
              O processo formal existe e está documentado e as evidências são
              comprovadas na maior parte das atividades com exceções em menos de
              10% do tempo.{" "}
            </td>
          </tr>
          <tr>
            <td>4 - Gerenciado </td>
            <td>
              A política e o padrão existem com aprovação formal da organização.
              Exceções à Política são documentadas e aprovadas e ocorrem menos
              de 3% do tempo.{" "}
            </td>
            <td>
              O processo formal existe e está documentado e as evidências são
              comprovadas em todas as atividades com detalhamento das métricas
              do processo. As métricas mínimas estão estabelecidas. As exceções
              ocorrem em menos de 5% dos casos.{" "}
            </td>
          </tr>
          <tr>
            <td>5 - Otimizado </td>
            <td>
              A política e o padrão existem com aprovação formal da organização.
              Exceções à Política são documentadas e aprovadas e ocorrem menos
              de 0,5% do tempo.{" "}
            </td>
            <td>
              O processo formal existe e está documentado e as evidências são
              comprovadas em todas as atividades com detalhamento das métricas
              do processo. As métricas mínimas estão estabelecidas. As exceções
              ocorrem em menos de 1% dos casos.{" "}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MaturityLevelTable;
