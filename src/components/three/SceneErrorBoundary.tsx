"use client";

import { Component, type ReactNode } from "react";

// The 3D scene now covers the entire hero section, so a WebGL failure
// (context creation, context loss under memory pressure — mobile Safari
// is especially prone to this) must not take the rest of the page down
// with it. Without this boundary an uncaught error here unmounts the
// whole React tree, leaving a blank screen instead of just a missing cat.
export class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Hero 3D scene failed to render:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
