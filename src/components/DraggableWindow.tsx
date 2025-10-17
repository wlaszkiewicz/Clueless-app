import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Draggable from "./Draggable";

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
  iconType?: string; // Add icon type prop
}

// Icon mapping for window title bars
const windowIconSources = {
  wardrobe: require("../assets/icons/wardrobe.png"),
  outfit: require("../assets/icons/outfit.png"),
  camera: require("../assets/icons/camera.png"),
  gallery: require("../assets/icons/gallery.png"),
  application: require("../assets/icons/application.png"),
  clueless: require("../assets/icons/application.png"),
  folder: require("../assets/icons/folder.png"), // default
};

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  onDrag,
  initialPosition,
  iconType = "folder",
}) => {
  const windowIconSource =
    windowIconSources[iconType as keyof typeof windowIconSources] ||
    windowIconSources.folder;

  return (
    <Draggable initialPosition={initialPosition} onDrag={onDrag}>
      <View style={styles.window}>
        {/* Classic 3D Border */}
        <View style={styles.borderOutset} />

        {/* Pink Title Bar */}
        <View style={styles.titleBar}>
          <Image source={windowIconSource} style={styles.titleIcon} />
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.windowControls}>
            <TouchableOpacity style={styles.controlButton} onPress={onMinimize}>
              <Text style={styles.controlText}>_</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Text style={styles.controlText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Bar */}
        <View style={styles.menuBar}>
          <Text style={styles.menuItem}>File</Text>
          <Text style={styles.menuItem}>Edit</Text>
          <Text style={styles.menuItem}>View</Text>
          <Text style={styles.menuItem}>Help</Text>
        </View>

        {/* Window Content */}
        <View style={styles.windowContent}>
          <View style={styles.contentArea}>{children}</View>

          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusText}>Ready</Text>
            <View style={styles.statusSeparator} />
            <Text style={styles.statusText}>Windows 2000</Text>
          </View>
        </View>

        {/* Resize Handle */}
        <View style={styles.resizeHandle} />
      </View>
    </Draggable>
  );
};

const styles = StyleSheet.create({
  window: {
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    minWidth: 320,
    minHeight: 240,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 8,
  },
  borderOutset: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "#000000",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
  },
  titleBar: {
    backgroundColor: "#ff66b2",
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
  },
  titleIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    marginLeft: 4,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
    fontFamily: "MS Sans Serif, System",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    userSelect: "none",
  },
  windowControls: {
    flexDirection: "row",
  },
  controlButton: {
    width: 18,
    height: 16,
    backgroundColor: "#c0c0c0",
    borderWidth: 1,
    borderColor: "#808080",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    marginLeft: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 12,
    marginTop: -2,
  },
  menuBar: {
    flexDirection: "row",
    backgroundColor: "#c0c0c0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
  },
  menuItem: {
    fontSize: 11,
    color: "#000000",
    marginRight: 16,
    fontFamily: "MS Sans Serif, System",
    fontWeight: "bold",
    userSelect: "none",
  },
  windowContent: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    padding: 12,
    minHeight: 160,
  },
  statusBar: {
    flexDirection: "row",
    backgroundColor: "#c0c0c0",
    padding: 4,
    borderTopWidth: 1,
    borderTopColor: "#808080",
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    color: "#000000",
    fontFamily: "MS Sans Serif, System",
    userSelect: "none",
  },
  statusSeparator: {
    width: 1,
    height: 12,
    backgroundColor: "#808080",
    marginHorizontal: 8,
  },
  resizeHandle: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#c0c0c0",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    borderTopColor: "#dfdfdf",
    borderLeftColor: "#dfdfdf",
  },
});

export default DraggableWindow;
