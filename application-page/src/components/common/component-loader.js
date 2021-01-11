import React, { useEffect, useState } from "react";
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
export default function ComponentLoader(props) {
  return (
    <div className="compoent-skeleton-loading">
        <>
        <Skeleton variant={props.type} width="100%" height={118} />
          <Box pt={0.5}>
            <Skeleton />
            <Skeleton width="100%" />
          </Box>
        </>
    </div>
  );
}
