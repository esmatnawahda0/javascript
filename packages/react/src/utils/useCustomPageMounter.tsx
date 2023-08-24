import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// This function takes a component as prop, and returns functions that mount and unmount
// the given component into a given node

// TODO: This function needs to accept an array of components, or else it errors when changing the array length
export const useCustomPageMounter = (component: JSX.Element) => {
  const [node, setNode] = useState<Element | null>(null);

  const mount = (node: Element) => {
    setNode(node);
  };
  const unmount = () => {
    setNode(null);
  };

  // If mount has been called, Wrapper returns a portal that renders `component`
  // into the passed node

  // Otherwise, Wrapper returns nothing
  const Wrapper = () => <>{node ? createPortal(component, node) : null}</>;

  return { Wrapper, mount, unmount };
};
