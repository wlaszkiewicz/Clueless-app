import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import DesktopIcon from "../components/DesktopIcon";
import DraggableWindow from "../components/DraggableWindow";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isMobile = screenWidth < 768;

const WindowsDesktop = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
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

  // Mobile layout: icons in two rows at top
  const mobileIconPositions = [
    { x: 20, y: 20 }, // Row 1
    { x: 120, y: 20 }, // Row 1
    { x: 220, y: 20 }, // Row 1
    { x: 20, y: 140 }, // Row 2
    { x: 120, y: 140 }, // Row 2
  ];

  const desktopIcons = [
    {
      id: "wardrobe",
      iconType: "wardrobe" as const,
      label: "My Wardrobe",
      initialX: isMobile ? mobileIconPositions[0].x : 20,
      initialY: isMobile ? mobileIconPositions[0].y : 20,
    },
    {
      id: "outfits",
      iconType: "outfit" as const,
      label: "Create Outfit",
      initialX: isMobile ? mobileIconPositions[1].x : 20,
      initialY: isMobile ? mobileIconPositions[1].y : 160,
    },
    {
      id: "addItem",
      iconType: "camera" as const,
      label: "Add Item",
      initialX: isMobile ? mobileIconPositions[2].x : 20,
      initialY: isMobile ? mobileIconPositions[2].y : 300,
    },
    {
      id: "gallery",
      iconType: "gallery" as const,
      label: "Style Gallery",
      initialX: isMobile ? mobileIconPositions[3].x : 20,
      initialY: isMobile ? mobileIconPositions[3].y : 440,
    },
    {
      id: "clueless",
      iconType: "clueless" as const,
      label: "Clueless",
      initialX: isMobile ? mobileIconPositions[4].x : 20,
      initialY: isMobile ? mobileIconPositions[4].y : 580,
    },
  ];

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId]);
      setMinimizedWindows(minimizedWindows.filter((id) => id !== windowId));

      if (!windowPositions[windowId]) {
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: {
            x: isMobile ? 50 : 150 + openWindows.length * 25,
            y: isMobile ? 200 : 100 + openWindows.length * 20,
          },
        }));
      }
    } else if (minimizedWindows.includes(windowId)) {
      // Restore minimized window
      setMinimizedWindows(minimizedWindows.filter((id) => id !== windowId));
    }
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId));
    setMinimizedWindows(minimizedWindows.filter((id) => id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setMinimizedWindows([...minimizedWindows, windowId]);
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

  // Taskbar icon sources
  const taskbarIconSources = {
    wardrobe: require("../assets/icons/wardrobe.png"),
    outfit: require("../assets/icons/outfit.png"),
    camera: require("../assets/icons/camera.png"),
    gallery: require("../assets/icons/gallery.png"),
    clueless: require("../assets/icons/application.png"),
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
            onDoubleClick={() => openWindow(icon.id)}
            onDrag={(position) => handleIconDrag(icon.id, position)}
          />
        ))}

        {/* Draggable Windows (only non-minimized ones) */}
        {openWindows
          .filter((windowId) => !minimizedWindows.includes(windowId))
          .map((windowId) => {
            const icon = desktopIcons.find((icon) => icon.id === windowId);
            return (
              <DraggableWindow
                key={windowId}
                title={icon?.label || "Window"}
                iconType={icon?.iconType}
                initialPosition={getWindowPosition(windowId)}
                onClose={() => closeWindow(windowId)}
                onMinimize={() => minimizeWindow(windowId)}
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
        {!isMobile && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Clueless Fashion Studio</Text>
            <Text style={styles.welcomeSubtitle}>
              Drag icons and windows anywhere!
            </Text>
          </View>
        )}
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
            const isMinimized = minimizedWindows.includes(windowId);
            const taskbarIconSource =
              taskbarIconSources[
                icon?.iconType as keyof typeof taskbarIconSources
              ] || taskbarIconSources.clueless;

            return (
              <TouchableOpacity
                key={windowId}
                style={[
                  styles.taskbarProgram,
                  isMinimized && styles.minimizedProgram,
                ]}
                onPress={() => openWindow(windowId)}
              >
                <Image source={taskbarIconSource} style={styles.taskbarIcon} />
                {!isMobile && (
                  <Text style={styles.taskbarProgramText}>{icon?.label}</Text>
                )}
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
    backgroundColor: "#87ceeb",
  },
  desktop: {
    flex: 1,
    padding: 16,
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
  windowText: {
    fontSize: 12,
    color: "#000000",
    lineHeight: 16,
    fontFamily: "MS Sans Serif, System",
    textAlign: "center",
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
    flexWrap: "wrap",
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
    marginBottom: 2,
  },
  minimizedProgram: {
    opacity: 0.6,
  },
  taskbarIcon: {
    width: 16,
    height: 16,
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
