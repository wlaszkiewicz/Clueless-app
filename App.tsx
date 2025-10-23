import React from "react";
import WindowsDesktop from "./src/WindowsDesktop";
import { WardrobeProvider } from "./src/contexts/WardrobeContext";

export default function App() {
  return (
    <WardrobeProvider>
      <WindowsDesktop />
    </WardrobeProvider>
  );
}
