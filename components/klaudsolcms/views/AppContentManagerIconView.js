import Link from "next/link";
import Image from "next/image";
import { useCapabilities } from "@/components/hooks";
import { readContents } from "@/lib/Constants";
import defaultImage from "@/public/default-image.svg";

const AppContentManagerIconView = ({ columns, entries, entity_type_slug }) => {
  const capabilities = useCapabilities();

  const findImage = (entry) => {
    const image = Object.keys(entry).find(
      (item) => entry[item] instanceof Object
    );

    const imageLink = entry[image]?.link;

    return imageLink;
  };

  return (
    <div className="card__container">
      {entries.map((entry) => {
        const imageLink = findImage(entry);

        return (
          <div className="card__item" key={entry.id}>
            <Link
              href={`/admin/content-manager/${entity_type_slug}/${entry.id}`}
              passHref
              legacyBehavior
              disabled={!capabilities.includes(readContents)}
            >
              <div className="card__image-container">
                <Image
                  src={imageLink ?? defaultImage}
                  alt={entry.slug}
                  className="card__image"
                  fill
                />
              </div>
            </Link>
            <div className="card__data">
              <div>{entry.id}</div>
              <div>{entry.slug}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppContentManagerIconView;
