import * as BiIcons from "react-icons/bi";
import { useContext, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import RootContext from "@/components/contexts/RootContext";
import { SET_ENTITY_TYPE } from "@/lib/actions";

const IconsListModalBody = ({
  iconData,
  setIconData,
  isLoading,
  setIsLoading,
}) => {
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);
  const [highlighted, setHighlighted] = useState(iconData.icon);

  const onClick = async (e) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const icon = e.currentTarget.value;
      setHighlighted(icon);

      const url = `/api/entity_types/${iconData.slug}/icon_change`;
      const params = {
        method: "PUT",
        "Content-Type": "application/json",
        body: JSON.stringify({ icon }),
      };

      await slsFetch(url, params);

      const itemToUpdate = rootState.entityTypes.find(
        ({ entity_type_slug }) => entity_type_slug === iconData.slug
      );

      const updatedItem = { ...itemToUpdate, entity_type_icon: icon };

      rootDispatch({
        type: SET_ENTITY_TYPE,
        payload: { slug: iconData.slug, entityType: updatedItem },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIconData("");
      setIsLoading(false);
    }
  };

  return (
    <div className="icon_list__container">
      {Object.keys(BiIcons).map((icon) => {
        const CurrentIcon = BiIcons[icon];

        return (
          <button
            className={`icon_list__button ${
              highlighted === icon && "icon_list__button--current"
            }`}
            onClick={onClick}
            key={icon}
            value={icon}
          >
            <CurrentIcon className="icon_list__item" />
          </button>
        );
      })}
    </div>
  );
};

export default IconsListModalBody;
