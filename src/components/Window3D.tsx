import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Theme } from "../constants/Theme";

interface Window3DProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  style?: any;
}

const Window3D: React.FC<Window3DProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  style,
}) => {
  return (
    <View style={[styles.window, style]}>
      {/* 3D Border Effect */}
      <View style={styles.borderTopLeft} />
      <View style={styles.borderTopRight} />
      <View style={styles.borderBottomLeft} />
      <View style={styles.borderBottomRight} />

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.windowControls}>
          {onMinimize && (
            <TouchableOpacity style={styles.controlButton} onPress={onMinimize}>
              <Text style={styles.controlText}>_</Text>
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Text style={styles.controlText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  window: {
    backgroundColor: Theme.colors.window,
    borderWidth: 2,
    borderColor: Theme.colors.borderLight,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 8,
  },
  borderTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 2,
    height: 2,
    backgroundColor: Theme.colors.borderLight,
  },
  borderTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 2,
    width: 2,
    backgroundColor: Theme.colors.borderLight,
  },
  borderBottomLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 2,
    height: 2,
    backgroundColor: Theme.colors.borderDark,
  },
  borderBottomRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 2,
    width: 2,
    backgroundColor: Theme.colors.borderDark,
  },
  titleBar: {
    backgroundColor: Theme.colors.titleBar,
    padding: Theme.spacing.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.borderDark,
  },
  titleText: {
    color: Theme.colors.titleText,
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "bold",
  },
  windowControls: {
    flexDirection: "row",
  },
  controlButton: {
    width: 20,
    height: 18,
    backgroundColor: Theme.colors.window,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    marginLeft: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
  },
  content: {
    padding: Theme.spacing.large,
    minHeight: 300,
    minWidth: 400,
  },
});

export default Window3D;
