import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import CacheContext from "@/components/contexts/CacheContext";
import AppEntityTypeList from "@/components/klaudsolcms/AppEntityTypeList";

import cx from "classnames";

const AppContentLink = ({ button }) => {
  const { defaultEntityType } = useContext(CacheContext);
  const router = useRouter();

  return (
    <>
      <Link
        href={`${button.path}${defaultEntityType}`}
        className={cx(
          router.asPath?.includes?.(button.path)
            ? "sidebar_buttons_active"
            : "sidebar_buttons"
        )}
      >
        {button.icon} {button.title}
      </Link>

      {router.pathname.includes(button.path) && (
        <AppEntityTypeList baseUrl={button.path} />
      )}
    </>
  );
};

export default AppContentLink;
