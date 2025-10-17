import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Theme } from "../constants/Theme";
import WindowsIcons from "./WindowsIcons";
import Draggable from "./Draggable";

interface DesktopIconProps {
  iconType:
    | "folder"
    | "paint"
    | "camera"
    | "gallery"
    | "application"
    | "clueless";
  label: string;
  onDoubleClick: () => void; // Changed from onPress to onDoubleClick
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
  isSelected?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  iconType,
  label,
  onDoubleClick, // Changed from onPress
  onDrag,
  initialPosition,
  isSelected,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case "folder":
        return <WindowsIcons.FolderIcon />;
      case "paint":
        return <WindowsIcons.PaintIcon />;
      case "camera":
        return <WindowsIcons.CameraIcon />;
      case "gallery":
        return <WindowsIcons.GalleryIcon />;
      case "application":
        return <WindowsIcons.ApplicationIcon />;
      case "clueless":
        return <WindowsIcons.ApplicationIcon />;
      default:
        return <WindowsIcons.ApplicationIcon />;
    }
  };

  return (
    <Draggable
      initialPosition={initialPosition}
      onDrag={onDrag}
      onDoubleClick={onDoubleClick} // Pass double click handler
    >
      <View style={[styles.iconContainer, isSelected && styles.selected]}>
        <View style={styles.iconWrapper}>{renderIcon()}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Draggable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    padding: 8,
    width: 70,
    borderRadius: 2,
  },
  selected: {
    backgroundColor: "rgba(0, 0, 255, 0.3)",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#c0c0c0",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
  },
  label: {
    fontFamily: "MS Sans Serif, System",
    fontSize: 11,
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

export default DesktopIcon;
