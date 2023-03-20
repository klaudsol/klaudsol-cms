import { useContext } from "react";
import Link from "next/link";
import useRouter from "next/router";
import RootContext from "@/components/contexts/RootContext";

const AppEntityTypeList = ({ baseUrl }) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const { entityTypes, currentContentType } = rootState;

  return (
    <ul className="entity_types_list">
      {entityTypes.map((entityType) => (
        <li key={entityType.entity_type_id}>
          <Link 
            href={`${baseUrl}${entityType.entity_type_slug}`}
            className={currentContentType.entity_type_name === entityType.entity_type_name 
                ? 'entity_types_list__link--active' 
                : 'entity_types_list__link'}
          >
            {entityType.entity_type_name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AppEntityTypeList;
