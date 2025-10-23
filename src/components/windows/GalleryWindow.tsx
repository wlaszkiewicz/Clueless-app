import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

interface GalleryWindowProps {
  isFullscreen?: boolean;
  isMobile?: boolean;
}

const GalleryWindow: React.FC<GalleryWindowProps> = ({
  isFullscreen = false,
  isMobile = false,
}) => {
  // Mobile preview content
  const mobilePreviewContent = (
    <View style={windowStyles.previewContent}>
      <Image
        source={require("../../assets/icons/gallery.png")}
        style={windowStyles.previewIcon}
      />
      <Text style={windowStyles.previewTitle}>Style Gallery</Text>
      <Text style={windowStyles.previewText}>
        Browse your saved outfits{"\n"}• View past creations{"\n"}• Get
        inspiration{"\n"}• Share styles
      </Text>
      <View style={windowStyles.previewStats}>
        <Text style={windowStyles.statsText}>🖼️ 12 outfits</Text>
        <Text style={windowStyles.statsText}>⭐ 3 favorites</Text>
      </View>
    </View>
  );

  // Full functionality
  const fullContent = (
    <View style={windowStyles.fullContent}>
      <Text style={windowStyles.fullTitle}>Style Gallery</Text>
      <Text style={windowStyles.fullSubtitle}>Your saved outfit creations</Text>

      <ScrollView style={windowStyles.gallery}>
        <View style={windowStyles.outfitGrid}>
          <View style={windowStyles.outfitCard}>
            <View style={windowStyles.outfitImage} />
            <Text style={windowStyles.outfitTitle}>Casual Day</Text>
          </View>
          <View style={windowStyles.outfitCard}>
            <View style={windowStyles.outfitImage} />
            <Text style={windowStyles.outfitTitle}>Evening Out</Text>
          </View>
          <View style={windowStyles.outfitCard}>
            <View style={windowStyles.outfitImage} />
            <Text style={windowStyles.outfitTitle}>Work Style</Text>
          </View>
          <View style={windowStyles.outfitCard}>
            <View style={windowStyles.outfitImage} />
            <Text style={windowStyles.outfitTitle}>Weekend</Text>
          </View>
        </View>
      </ScrollView>

      <View style={windowStyles.actionBar}>
        <TouchableOpacity style={windowStyles.actionButton}>
          <Text style={windowStyles.actionText}>New Collection</Text>
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
  gallery: {
    flex: 1,
  },
  outfitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  outfitCard: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  outfitImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginBottom: 8,
  },
  outfitTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionBar: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: "#ff66b2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GalleryWindow;
