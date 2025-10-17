import React from "react";
import { View, StyleSheet, Image } from "react-native";

// Windows 95-style icons using images
export const FolderIcon = () => (
  <View style={styles.iconContainer}>
    <Image
      source={require("../assets/icons/folder.png")}
      style={styles.iconImage}
    />
  </View>
);

export const PaintIcon = () => (
  <View style={styles.iconContainer}>
    <Image
      source={require("../assets/icons/paint.png")}
      style={styles.iconImage}
    />
  </View>
);

export const CameraIcon = () => (
  <View style={styles.iconContainer}>
    <Image
      source={require("../assets/icons/camera.png")}
      style={styles.iconImage}
    />
  </View>
);

export const GalleryIcon = () => (
  <View style={styles.iconContainer}>
    <Image
      source={require("../assets/icons/gallery.png")}
      style={styles.iconImage}
    />
  </View>
);

export const ApplicationIcon = () => (
  <View style={styles.iconContainer}>
    <Image
      source={require("../assets/icons/application.png")}
      style={styles.iconImage}
    />
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});

export default {
  FolderIcon,
  PaintIcon,
  CameraIcon,
  GalleryIcon,
  ApplicationIcon,
};
