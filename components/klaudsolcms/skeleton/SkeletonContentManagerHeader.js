import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";

// This is not really a skeleton
const SkeletonContentManagerHeader = () => {
  return (
    <div>
      <div className="general-header">
        Loading... <AppButtonSpinner />
      </div>
      <a href="#" target="_blank" rel="noreferrer">
        api/...
      </a>
      <p> Loading entries... </p>
    </div>
  );
};

export default SkeletonContentManagerHeader;
