import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface CluelessWindowProps {
  isFullscreen?: boolean;
  isMobile?: boolean;
}

const CluelessWindow: React.FC<CluelessWindowProps> = ({
  isFullscreen = false,
  isMobile = false,
}) => {
  return (
    <View style={windowStyles.content}>
      <Text style={windowStyles.title}>Welcome to Clueless!</Text>
      <Text style={windowStyles.subtitle}>Your digital wardrobe organizer</Text>

      <View style={windowStyles.features}>
        <Text style={windowStyles.feature}>👕 Organize your wardrobe</Text>
        <Text style={windowStyles.feature}>👖 Create amazing outfits</Text>
        <Text style={windowStyles.feature}>👟 Virtual try-on</Text>
        <Text style={windowStyles.feature}>👜 Style gallery</Text>
      </View>

      <Text style={windowStyles.tip}>
        {isMobile
          ? "💡 Use fullscreen for best experience!"
          : "Get started by opening any application!"}
      </Text>
    </View>
  );
};

const windowStyles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 80,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  features: {
    alignItems: "flex-start",
    marginBottom: 30,
  },
  feature: {
    fontSize: 14,
    marginBottom: 8,
  },
  tip: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default CluelessWindow;
