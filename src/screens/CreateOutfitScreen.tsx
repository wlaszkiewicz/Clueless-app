// src/screens/CreateOutfitScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Image,
} from "react-native";
import DraggableWindow from "../components/DraggableWindow";
import { Theme } from "../constants/Theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isMobile = screenWidth < 768;

interface CanvasItem {
  id: string;
  name: string;
  type: string;
  color?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image?: any; // Could be require() or URI
}

const CreateOutfitScreen = ({ onClose }: { onClose: () => void }) => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedBackground, setSelectedBackground] =
    useState<string>("#ffffff");
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  // Sample clothing items - in real app these would come from your wardrobe
  const clothingItems = [
    {
      id: "1",
      name: "Red Blouse",
      type: "top",
      color: "#ff6b6b",
      width: 80,
      height: 100,
    },
    {
      id: "2",
      name: "Blue Jeans",
      type: "bottom",
      color: "#4d4dff",
      width: 70,
      height: 120,
    },
    {
      id: "3",
      name: "Yellow Dress",
      type: "dress",
      color: "#ffeb3b",
      width: 90,
      height: 150,
    },
    {
      id: "4",
      name: "Black Heels",
      type: "shoes",
      color: "#333333",
      width: 60,
      height: 40,
    },
    {
      id: "5",
      name: "Leather Bag",
      type: "accessory",
      color: "#8b4513",
      width: 50,
      height: 40,
    },
  ];

  const backgrounds = [
    { id: "bg1", name: "White", color: "#ffffff" },
    { id: "bg2", name: "Light Gray", color: "#f0f0f0" },
    { id: "bg3", name: "Soft Pink", color: "#ffccf9" },
    { id: "bg4", name: "Sky Blue", color: "#ccffff" },
  ];

  const createPanResponder = (item: CanvasItem) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggingItem(item.id);
      },
      onPanResponderMove: (_, gestureState) => {
        setCanvasItems((currentItems) =>
          currentItems.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  x: Math.max(
                    0,
                    Math.min(screenWidth - 200, currentItem.x + gestureState.dx)
                  ),
                  y: Math.max(
                    0,
                    Math.min(400, currentItem.y + gestureState.dy)
                  ),
                }
              : currentItem
          )
        );
      },
      onPanResponderRelease: () => {
        setDraggingItem(null);
      },
    });
  };

  const addItemToCanvas = (item: any) => {
    const newItem: CanvasItem = {
      ...item,
      x: 50,
      y: 50,
    };
    setCanvasItems([...canvasItems, newItem]);
  };

  const removeItem = (itemId: string) => {
    setCanvasItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const clearCanvas = () => {
    setCanvasItems([]);
  };

  const saveOutfit = () => {
    console.log("Outfit saved:", canvasItems);
    alert("Outfit saved to your gallery! 🎉");
  };

  return (
    <DraggableWindow
      title="Create Outfit - Clueless"
      onClose={onClose}
      width={isMobile ? screenWidth * 0.95 : 700}
      height={isMobile ? screenHeight * 0.8 : 600}
    >
      <View style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Canvas Area */}
          <View style={styles.canvasSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>OUTFIT CANVAS</Text>
              <TouchableOpacity
                onPress={clearCanvas}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.canvas,
                {
                  backgroundColor: selectedBackground,
                  height: isMobile ? 250 : 350,
                },
              ]}
            >
              {canvasItems.length === 0 ? (
                <View style={styles.emptyCanvas}>
                  <Text style={styles.emptyText}>
                    👗 Drag items here to create your outfit!
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Start by selecting clothing from the palette below
                  </Text>
                </View>
              ) : (
                canvasItems.map((item) => {
                  const panResponder = createPanResponder(item);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.canvasItem,
                        {
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          height: item.height,
                          backgroundColor: item.color,
                          zIndex: draggingItem === item.id ? 1000 : 1,
                          elevation: draggingItem === item.id ? 1000 : 1,
                        },
                      ]}
                      {...panResponder.panHandlers}
                    >
                      <Text style={styles.canvasItemText}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Text style={styles.removeText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>

            {/* Background Selection */}
            <View style={styles.backgroundSection}>
              <Text style={styles.sectionTitle}>BACKGROUND</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.backgroundRow}>
                  {backgrounds.map((bg) => (
                    <TouchableOpacity
                      key={bg.id}
                      style={[
                        styles.backgroundOption,
                        { backgroundColor: bg.color },
                        selectedBackground === bg.color &&
                          styles.selectedBackground,
                      ]}
                      onPress={() => setSelectedBackground(bg.color)}
                    >
                      <Text style={styles.backgroundLabel}>{bg.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Items Palette */}
          <View style={styles.paletteSection}>
            <Text style={styles.sectionTitle}>WARDROBE ITEMS</Text>
            <ScrollView
              horizontal={isMobile}
              showsHorizontalScrollIndicator={true}
              style={styles.itemsScrollView}
            >
              <View style={isMobile ? styles.mobileItemsRow : styles.itemsGrid}>
                {clothingItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.paletteItem,
                      isMobile && styles.mobilePaletteItem,
                    ]}
                    onPress={() => addItemToCanvas(item)}
                  >
                    <View
                      style={[
                        styles.itemThumbnail,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.itemLabel}>{item.name}</Text>
                    <Text style={styles.itemType}>
                      {item.type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.actionButton} onPress={saveOutfit}>
            <Text style={styles.buttonText}>💾 SAVE OUTFIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.buttonText}>← BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DraggableWindow>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  canvasSection: {
    flex: 2,
    marginBottom: Theme.spacing.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
  },
  sectionTitle: {
    fontFamily: Theme.fonts.system,
    fontSize: 11,
    color: Theme.colors.text,
    fontWeight: "bold",
  },
  canvas: {
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    position: "relative",
    marginBottom: Theme.spacing.medium,
  },
  emptyCanvas: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.large,
  },
  emptyText: {
    fontFamily: Theme.fonts.system,
    fontSize: 14,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.small,
    textAlign: "center",
  },
  emptySubtext: {
    fontFamily: Theme.fonts.system,
    fontSize: 11,
    color: Theme.colors.text,
    textAlign: "center",
  },
  canvasItem: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    padding: 4,
  },
  canvasItemText: {
    fontFamily: Theme.fonts.system,
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: "#ff0000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 12,
  },
  backgroundSection: {
    marginBottom: Theme.spacing.medium,
  },
  backgroundRow: {
    flexDirection: "row",
  },
  backgroundOption: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    marginRight: Theme.spacing.small,
  },
  selectedBackground: {
    borderColor: Theme.colors.highlight,
    borderWidth: 3,
  },
  backgroundLabel: {
    fontFamily: Theme.fonts.system,
    fontSize: 9,
    color: Theme.colors.text,
    fontWeight: "bold",
  },
  paletteSection: {
    borderTopWidth: 2,
    borderTopColor: Theme.colors.borderDark,
    paddingTop: Theme.spacing.medium,
    flex: 1,
  },
  itemsScrollView: {
    flex: 1,
  },
  mobileItemsRow: {
    flexDirection: "row",
    paddingVertical: Theme.spacing.small,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  paletteItem: {
    alignItems: "center",
    padding: Theme.spacing.small,
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    margin: Theme.spacing.small,
    backgroundColor: Theme.colors.window,
    minWidth: 80,
  },
  mobilePaletteItem: {
    marginBottom: 0,
    marginRight: Theme.spacing.small,
  },
  itemThumbnail: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    marginBottom: 6,
  },
  itemLabel: {
    fontFamily: Theme.fonts.system,
    fontSize: 10,
    color: Theme.colors.text,
    textAlign: "center",
    marginBottom: 2,
  },
  itemType: {
    fontFamily: Theme.fonts.system,
    fontSize: 8,
    backgroundColor: Theme.colors.borderDark,
    color: Theme.colors.titleText,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Theme.spacing.medium,
    borderTopWidth: 2,
    borderTopColor: Theme.colors.borderDark,
  },
  actionButton: {
    backgroundColor: Theme.colors.titleBar,
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    paddingHorizontal: Theme.spacing.large,
    paddingVertical: Theme.spacing.medium,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.window,
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    paddingHorizontal: Theme.spacing.large,
    paddingVertical: Theme.spacing.medium,
  },
  smallButton: {
    backgroundColor: Theme.colors.window,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small,
  },
  buttonText: {
    fontFamily: Theme.fonts.system,
    fontSize: 11,
    color: Theme.colors.titleText,
    fontWeight: "bold",
  },
  smallButtonText: {
    fontFamily: Theme.fonts.system,
    fontSize: 10,
    color: Theme.colors.text,
  },
});

export default CreateOutfitScreen;
