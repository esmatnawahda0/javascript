import { useEffect, useRef } from 'react';

export const MountCustomPage = ({
  mountCustomPage,
  unmountCustomPage,
}: {
  mountCustomPage: any;
  unmountCustomPage: any;
}) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    let elRef: any = null;
    if (nodeRef.current) {
      elRef = nodeRef.current;
      mountCustomPage(nodeRef.current);
    }
    return () => {
      // if (nodeRef.current) {
      unmountCustomPage(elRef);
      // }
    };
  }, [nodeRef.current]);
  return (
    <>
      <div>MountCustomPage component</div>
      <div ref={nodeRef}></div>
    </>
  );
};
