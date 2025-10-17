import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DesktopIcon from "../components/DesktopIcon";
import DraggableWindow from "../components/DraggableWindow";

const WindowsDesktop = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [iconPositions, setIconPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [windowPositions, setWindowPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const desktopIcons = [
    {
      id: "wardrobe",
      iconType: "folder" as const,
      label: "My Wardrobe",
      initialX: 50,
      initialY: 50,
    },
    {
      id: "outfits",
      iconType: "paint" as const,
      label: "Create Outfit",
      initialX: 50,
      initialY: 120,
    },
    {
      id: "addItem",
      iconType: "camera" as const,
      label: "Add Item",
      initialX: 50,
      initialY: 190,
    },
    {
      id: "gallery",
      iconType: "gallery" as const,
      label: "Style Gallery",
      initialX: 50,
      initialY: 260,
    },
    {
      id: "clueless",
      iconType: "application" as const,
      label: "Clueless",
      initialX: 50,
      initialY: 330,
    },
  ];

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId]);
      // Set initial window position
      if (!windowPositions[windowId]) {
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: {
            x: 150 + openWindows.length * 25,
            y: 100 + openWindows.length * 20,
          },
        }));
      }
    }
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId));
  };

  const handleIconDrag = (
    iconId: string,
    position: { x: number; y: number }
  ) => {
    setIconPositions((prev) => ({
      ...prev,
      [iconId]: position,
    }));
  };

  const handleWindowDrag = (
    windowId: string,
    position: { x: number; y: number }
  ) => {
    setWindowPositions((prev) => ({
      ...prev,
      [windowId]: position,
    }));
  };

  const getIconPosition = (iconId: string) => {
    return (
      iconPositions[iconId] || {
        x: desktopIcons.find((icon) => icon.id === iconId)?.initialX || 50,
        y: desktopIcons.find((icon) => icon.id === iconId)?.initialY || 50,
      }
    );
  };

  const getWindowPosition = (windowId: string) => {
    return windowPositions[windowId] || { x: 150, y: 100 };
  };

  return (
    <View style={styles.container}>
      {/* Light Blue Desktop Background */}
      <View style={styles.desktop}>
        {/* Draggable Desktop Icons */}
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            iconType={icon.iconType}
            label={icon.label}
            initialPosition={getIconPosition(icon.id)}
            onDoubleClick={() => openWindow(icon.id)} // Changed to onDoubleClick
            onDrag={(position) => handleIconDrag(icon.id, position)}
          />
        ))}
        {/* Draggable Windows */}
        {openWindows.map((windowId) => {
          const icon = desktopIcons.find((icon) => icon.id === windowId);
          return (
            <DraggableWindow
              key={windowId}
              title={icon?.label || "Window"}
              initialPosition={getWindowPosition(windowId)}
              onClose={() => closeWindow(windowId)}
              onDrag={(position) => handleWindowDrag(windowId, position)}
            >
              <Text style={styles.windowText}>
                {windowId === "clueless"
                  ? "Welcome to Clueless! 💎\n\nDrag me around the desktop!\nDrag the icons too!"
                  : `This is the ${icon?.label} window.\n\nDrag me anywhere!`}
              </Text>
            </DraggableWindow>
          );
        })}
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Clueless Fashion Studio</Text>
          <Text style={styles.welcomeSubtitle}>
            Drag icons and windows anywhere!
          </Text>
        </View>
      </View>

      {/* Taskbar */}
      <View style={styles.taskbar}>
        <TouchableOpacity style={styles.startButton}>
          <View style={styles.startLogo}>🎀</View>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>

        <View style={styles.taskbarPrograms}>
          {openWindows.map((windowId) => {
            const icon = desktopIcons.find((icon) => icon.id === windowId);
            return (
              <TouchableOpacity key={windowId} style={styles.taskbarProgram}>
                <Text style={styles.taskbarIcon}>📁</Text>
                <Text style={styles.taskbarProgramText}>{icon?.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.systemTray}>
          <View style={styles.trayIcons}>
            <Text style={styles.trayIcon}>🔊</Text>
            <Text style={styles.trayIcon}>📶</Text>
          </View>
          <View style={styles.clock}>
            <Text style={styles.clockText}>{currentTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87ceeb", // Light sky blue"
  },
  desktop: {
    flex: 1,
    padding: 16,
  },
  iconsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  welcomeContainer: {
    position: "absolute",
    bottom: 120,
    right: 40,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#34495e",
    fontStyle: "italic",
  },
  welcomeText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    textShadowColor: "#000080",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  window: {
    position: "absolute",
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
    backgroundColor: "#ff66b2", // Pretty pink
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
  },
  titleIcon: {
    fontSize: 12,
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
  minimizeButton: {
    // Same as controlButton
  },
  closeButton: {
    // Same as controlButton
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
  },
  windowContent: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  windowText: {
    fontSize: 12,
    color: "#000000",
    lineHeight: 16,
    fontFamily: "MS Sans Serif, System",
    textAlign: "center",
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
  taskbar: {
    height: 40,
    backgroundColor: "#c0c0c0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: "#dfdfdf",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    marginRight: 8,
  },
  startLogo: {
    fontSize: 14,
    marginRight: 6,
  },
  startText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#000000",
    fontFamily: "MS Sans Serif, System",
  },
  taskbarPrograms: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  taskbarProgram: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#c0c0c0",
    borderWidth: 1,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    marginRight: 6,
  },
  taskbarIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  taskbarProgramText: {
    fontSize: 11,
    color: "#000000",
    fontFamily: "MS Sans Serif, System",
  },
  systemTray: {
    flexDirection: "row",
    alignItems: "center",
  },
  trayIcons: {
    flexDirection: "row",
    marginRight: 8,
  },
  trayIcon: {
    fontSize: 14,
    marginLeft: 6,
  },
  clock: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#c0c0c0",
    borderWidth: 1,
    borderTopColor: "#808080",
    borderLeftColor: "#808080",
    borderRightColor: "#ffffff",
    borderBottomColor: "#ffffff",
  },
  clockText: {
    fontSize: 11,
    color: "#000000",
    fontFamily: "MS Sans Serif, System",
  },
});

export default WindowsDesktop;
