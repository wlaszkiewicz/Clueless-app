import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface DressMeWindowProps {
  isFullscreen?: boolean;
  isMobile?: boolean;
}

const DressMeWindow: React.FC<DressMeWindowProps> = ({
  isFullscreen = false,
  isMobile = false,
}) => {
  // Mobile preview content
  const mobilePreviewContent = (
    <View style={windowStyles.previewContent}>
      <Image
        source={require("../../assets/icons/dressMe.png")}
        style={windowStyles.previewIcon}
      />
      <Text style={windowStyles.previewTitle}>Dress Me</Text>
      <Text style={windowStyles.previewText}>
        Virtual try-on feature{"\n"}• See how clothes look on you{"\n"}• Mix and
        match virtually{"\n"}• Plan your outfits
      </Text>
      <View style={windowStyles.previewStats}>
        <Text style={windowStyles.statsText}>👤 Your avatar</Text>
        <Text style={windowStyles.statsText}>🔄 Try-on</Text>
      </View>
    </View>
  );

  // Full functionality
  const fullContent = (
    <View style={windowStyles.fullContent}>
      <Text style={windowStyles.fullTitle}>Dress Me</Text>
      <Text style={windowStyles.fullSubtitle}>Virtual try-on experience</Text>

      <View style={windowStyles.tryOnArea}>
        <View style={windowStyles.avatar}>
          <Text style={windowStyles.avatarText}>Your Avatar</Text>
        </View>

        <View style={windowStyles.clothingOptions}>
          <Text style={windowStyles.optionsTitle}>Try On:</Text>
          <View style={windowStyles.optionsGrid}>
            <TouchableOpacity style={windowStyles.clothingItem}>
              <Text>👕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={windowStyles.clothingItem}>
              <Text>👖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={windowStyles.clothingItem}>
              <Text>👗</Text>
            </TouchableOpacity>
            <TouchableOpacity style={windowStyles.clothingItem}>
              <Text>🧥</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={windowStyles.actionBar}>
        <TouchableOpacity style={windowStyles.actionButton}>
          <Text style={windowStyles.actionText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={windowStyles.actionButton}>
          <Text style={windowStyles.actionText}>Start Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return isMobile && !isFullscreen ? mobilePreviewContent : fullContent;
};

const windowStyles = StyleSheet.create({
  previewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  previewIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  previewText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 16,
    color: "#666",
  },
  previewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  statsText: {
    fontSize: 10,
    color: "#888",
  },
  fullContent: {
    flex: 1,
    padding: 16,
  },
  fullTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  fullSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  tryOnArea: {
    flex: 1,
    gap: 16,
  },
  avatar: {
    flex: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  avatarText: {
    color: "#999",
    fontSize: 16,
  },
  clothingOptions: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    padding: 12,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  clothingItem: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: "#ff66b2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DressMeWindow;
