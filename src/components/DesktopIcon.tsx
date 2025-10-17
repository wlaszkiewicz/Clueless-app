import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import Draggable from "./Draggable";

interface DesktopIconProps {
  iconType:
    | "folder"
    | "camera"
    | "gallery"
    | "application"
    | "clueless"
    | "wardrobe"
    | "outfit";
  label: string;
  onDoubleClick: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
  isSelected?: boolean;
}

// Icon mapping - update these paths to match your downloaded icons
const iconSources = {
  folder: require("../assets/icons/folder.png"),
  camera: require("../assets/icons/camera.png"),
  gallery: require("../assets/icons/gallery.png"),
  application: require("../assets/icons/application.png"),
  clueless: require("../assets/icons/application.png"), // Add your clueless icon
  wardrobe: require("../assets/icons/wardrobe.png"), // Add your wardrobe icon
  outfit: require("../assets/icons/outfit.png"),
};

const DesktopIcon: React.FC<DesktopIconProps> = ({
  iconType,
  label,
  onDoubleClick,
  onDrag,
  initialPosition,
  isSelected,
}) => {
  const renderIcon = () => {
    const iconSource = iconSources[iconType] || iconSources.application;

    return (
      <Image
        source={iconSource}
        style={styles.iconImage}
        resizeMode="contain"
      />
    );
  };

  return (
    <Draggable
      initialPosition={initialPosition}
      onDrag={onDrag}
      onDoubleClick={onDoubleClick}
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
    padding: 12, // More padding for bigger feel
    width: 80, // Wider for better spacing
    borderRadius: 2,
  },
  selected: {
    backgroundColor: "rgba(0, 0, 255, 0.3)",
  },
  iconWrapper: {
    width: 70, // Bigger icons
    height: 70, // Bigger icons
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconImage: {
    width: 70, // Larger icon size
    height: 70,
  },
  label: {
    fontFamily: "MS Sans Serif, System",
    fontSize: 11,
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker background for better readability
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    // Prevent text selection
    userSelect: "none",
  },
});

export default DesktopIcon;
