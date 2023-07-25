import Link from "next/link";
import NextImage from "next/image";
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

    return imageLink ?? defaultImage;
  };

  const getTitle = (entry) => {
    const key = Object.keys(entry).find(
      (item) => (item !== "slug" && 
                 item !== "status" &&
                 typeof entry[item] === "string")
    );

    return entry[key] ?? entry.slug;
  };

  return (
    <div className="card__container">
      {entries.map((entry) => (
        <div className="card__item" key={entry.id}>
          <Link
            href={`/admin/content-manager/${entity_type_slug}/${entry.id}`}
            passHref
            legacyBehavior
            disabled={!capabilities.includes(readContents)}
          >
            <div className="card__image-container">
              <NextImage
                src={findImage(entry)}
                alt={entry.slug}
                className="card__image"
                sizes={290}
                fill
              />
            </div>
          </Link>
          <div className="card__data-container">
            <div className="card__data">{getTitle(entry)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppContentManagerIconView;
