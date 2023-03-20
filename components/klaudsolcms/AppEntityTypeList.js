import { useContext } from "react";
import Link from "next/link";
import RootContext from "@/components/contexts/RootContext";

const AppEntityTypeList = ({ baseUrl }) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const { entityTypes } = rootState;

  return (
    <ul>
      {entityTypes.map((entityType) => (
        <li key={entityType.entity_type_id}>
          <Link href={`${baseUrl}${entityType.entity_type_slug}`}>
            {entityType.entity_type_name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AppEntityTypeList;
