import { Skeleton } from "antd";
import React from "react";

export const PageSkeleton = () => {
  const skeletonParagraph = (
    <Skeleton
      active
      paragraph={{ rows: 4 }}
      className="page-skeleton__paragraph"
    />
  );

  return (
    <>
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
    </>
  );
};
