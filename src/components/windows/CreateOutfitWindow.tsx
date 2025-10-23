import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { wardrobeStorage, WardrobeItem } from "../../utils/storage";
import Draggable from "./../Draggable";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CreateOutfitWindowProps {
  isFullscreen?: boolean;
  isMobile?: boolean;
}

type OutfitItem = {
  id: string;
  item: WardrobeItem;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

const CreateOutfitWindow: React.FC<CreateOutfitWindowProps> = ({
  isFullscreen = false,
  isMobile = false,
}) => {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
  const canvasRef = useRef<View>(null);

  const categories = [
    {
      id: "all",
      label: "All Items",
      icon: require("../../assets/icons/outfit.png"),
    },
    { id: "tops", label: "Tops", icon: require("../../assets/icons/tops.png") },
    {
      id: "bottoms",
      label: "Bottoms",
      icon: require("../../assets/icons/bottoms.png"),
    },
    {
      id: "dresses",
      label: "Dresses",
      icon: require("../../assets/icons/dresses.png"),
    },
    {
      id: "shoes",
      label: "Shoes",
      icon: require("../../assets/icons/shoes.png"),
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: require("../../assets/icons/jewelry.png"),
    },
    {
      id: "outerwear",
      label: "Outerwear",
      icon: require("../../assets/icons/outerwear.png"),
    },
  ];

  useEffect(() => {
    loadWardrobeItems();
    measureCanvas();
  }, []);

  const loadWardrobeItems = async () => {
    try {
      const items = await wardrobeStorage.getItems();
      setWardrobeItems(items);
    } catch (error) {
      console.error("❌ Failed to load items:", error);
    }
  };

  const measureCanvas = () => {
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.measure((x, y, width, height) => {
          if (width > 0 && height > 0) {
            setCanvasSize({ width, height });
          }
        });
      }
    }, 100);
  };

  const getFilteredItems = () => {
    if (selectedCategory === "all") {
      return wardrobeItems;
    }
    return wardrobeItems.filter((item) => item.category === selectedCategory);
  };

  const addItemToCanvas = (item: WardrobeItem) => {
    const newOutfitItem: OutfitItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      position: {
        x: Math.random() * (canvasSize.width - 80),
        y: Math.random() * (canvasSize.height - 80),
      },
      size: { width: 80, height: 80 },
    };
    setOutfitItems((prev) => [...prev, newOutfitItem]);
  };

  const handleCanvasItemDrag = (
    itemId: string,
    position: { x: number; y: number }
  ) => {
    setOutfitItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, position } : item))
    );
  };

  const handleCanvasItemResize = (
    itemId: string,
    direction: "increase" | "decrease"
  ) => {
    setOutfitItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const scaleFactor = direction === "increase" ? 1.2 : 0.8;
          const newSize = {
            width: Math.max(40, Math.min(200, item.size.width * scaleFactor)),
            height: Math.max(40, Math.min(200, item.size.height * scaleFactor)),
          };
          return { ...item, size: newSize };
        }
        return item;
      })
    );
  };

  const removeItemFromCanvas = (itemId: string) => {
    setOutfitItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCanvas = () => {
    setOutfitItems([]);
  };

  const saveOutfitAsImage = async () => {
    // This would integrate with a screenshot/canvas to image library
    // For now, we'll just show an alert
    alert(
      "Outfit saved! (Image export functionality would be implemented here)"
    );
  };

  const mobilePreviewContent = (
    <View style={windowStyles.previewContent}>
      <Image
        source={require("../../assets/icons/outfit.png")}
        style={windowStyles.previewIcon}
      />
      <Text style={windowStyles.previewText}>
        Mix and match your clothes{"\n"}Create stylish combinations
      </Text>
      <View style={windowStyles.previewStats}>
        <Text style={windowStyles.statsText}>
          Items: {wardrobeItems.length}
        </Text>
      </View>
    </View>
  );

  const fullContent = (
    <View style={windowStyles.fullContent}>
      <Text style={windowStyles.fullTitle}>Create Outfit</Text>
      <Text style={windowStyles.fullSubtitle}>
        Drag items from your wardrobe to the canvas to create outfits
      </Text>

      <View style={windowStyles.mainLayout}>
        {/* Canvas Area - Left Side */}
        <View style={windowStyles.canvasSection}>
          <View style={windowStyles.canvasHeader}>
            <Text style={windowStyles.sectionTitle}>Outfit Canvas</Text>
            <View style={windowStyles.canvasControls}>
              <TouchableOpacity
                style={windowStyles.canvasButton}
                onPress={clearCanvas}
              >
                <Text style={windowStyles.canvasButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[windowStyles.canvasButton, windowStyles.saveButton]}
                onPress={saveOutfitAsImage}
              >
                <Text style={windowStyles.canvasButtonText}>Save as Image</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            ref={canvasRef}
            style={windowStyles.canvas}
            onLayout={measureCanvas}
          >
            {/* White background for the canvas */}
            <View style={windowStyles.canvasBackground} />

            {/* Outfit items on canvas */}
            {outfitItems.map((outfitItem) => (
              <Draggable
                key={outfitItem.id}
                initialPosition={outfitItem.position}
                onDrag={(position) =>
                  handleCanvasItemDrag(outfitItem.id, position)
                }
              >
                <View
                  style={[
                    windowStyles.canvasItem,
                    {
                      width: outfitItem.size.width,
                      height: outfitItem.size.height,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: outfitItem.item.imageUri }}
                    style={[
                      windowStyles.canvasItemImage,
                      {
                        width: outfitItem.size.width,
                        height: outfitItem.size.height,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    style={windowStyles.removeItemButton}
                    onPress={() => removeItemFromCanvas(outfitItem.id)}
                  >
                    <Text style={windowStyles.removeItemText}>×</Text>
                  </TouchableOpacity>

                  {/* Resize Controls */}
                  <View
                    style={windowStyles.resizeControls}
                    pointerEvents="box-none"
                  >
                    <TouchableOpacity
                      style={[
                        windowStyles.resizeButton,
                        windowStyles.decreaseButton,
                      ]}
                      onPress={() =>
                        handleCanvasItemResize(outfitItem.id, "decrease")
                      }
                    >
                      <Text style={windowStyles.resizeButtonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        windowStyles.resizeButton,
                        windowStyles.increaseButton,
                      ]}
                      onPress={() =>
                        handleCanvasItemResize(outfitItem.id, "increase")
                      }
                    >
                      <Text style={windowStyles.resizeButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Draggable>
            ))}

            {/* Empty state */}
            {outfitItems.length === 0 && (
              <View style={windowStyles.emptyCanvas}>
                <Image
                  source={require("../../assets/icons/outfit.png")}
                  style={windowStyles.emptyCanvasIcon}
                />
                <Text style={windowStyles.emptyCanvasText}>
                  Drag items from your wardrobe to start creating!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Wardrobe Items - Right Side */}
        <View style={windowStyles.wardrobeSection}>
          <Text style={windowStyles.sectionTitle}>Your Wardrobe</Text>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={windowStyles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  windowStyles.categoryButton,
                  selectedCategory === category.id &&
                    windowStyles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Image
                  source={category.icon}
                  style={windowStyles.categoryIcon}
                />
                <Text style={windowStyles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Items Grid */}
          <ScrollView style={windowStyles.itemsGrid}>
            {getFilteredItems().map((item) => (
              <TouchableOpacity
                key={item.id}
                style={windowStyles.wardrobeItem}
                onPress={() => addItemToCanvas(item)}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={windowStyles.wardrobeItemImage}
                />
                <Text style={windowStyles.wardrobeItemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}

            {getFilteredItems().length === 0 && (
              <View style={windowStyles.emptyWardrobe}>
                <Text style={windowStyles.emptyWardrobeText}>
                  No items in{" "}
                  {selectedCategory === "all"
                    ? "your wardrobe"
                    : "this category"}
                </Text>
                <Text style={windowStyles.emptyWardrobeSubtext}>
                  Add items in the Add Item window
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
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
    marginTop: 8,
  },
  statsText: {
    fontSize: 10,
    color: "#888",
  },
  fullContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#c0c0c0",
  },
  fullTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  fullSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  mainLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
  },
  canvasSection: {
    flex: 2,
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    padding: 12,
  },
  wardrobeSection: {
    flex: 1,
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    padding: 12,
    minWidth: 250,
  },
  canvasHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  canvasControls: {
    flexDirection: "row",
    gap: 8,
  },
  canvasButton: {
    backgroundColor: "#c0c0c0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
  },
  saveButton: {
    backgroundColor: "#ffffcc",
  },
  canvasButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  canvas: {
    flex: 1,
    backgroundColor: "transparent",
    position: "relative",
    minHeight: 500,
  },
  canvasBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
  },
  canvasItem: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  canvasItemImage: {
    borderRadius: 4,
  },
  removeItemButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff4444",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  removeItemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },
  resizeControls: {
    position: "absolute",
    bottom: -30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  resizeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  increaseButton: {
    backgroundColor: "#4CAF50",
  },
  decreaseButton: {
    backgroundColor: "#f44336",
  },
  resizeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyCanvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyCanvasIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyCanvasText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  categoryScroll: {
    marginBottom: 12,
    maxHeight: 80,
  },
  categoryButton: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    marginRight: 8,
    minWidth: 70,
  },
  categoryButtonSelected: {
    borderColor: "#000",
    backgroundColor: "#ffffcc",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemsGrid: {
    flex: 1,
  },
  wardrobeItem: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderColor: "#dfdfdf",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
    marginBottom: 8,
  },
  wardrobeItemImage: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  wardrobeItemName: {
    fontSize: 10,
    textAlign: "center",
    color: "#000",
    maxWidth: 80,
  },
  emptyWardrobe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyWardrobeText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  emptyWardrobeSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default CreateOutfitWindow;
