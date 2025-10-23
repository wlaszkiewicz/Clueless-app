import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { wardrobeStorage, WardrobeItem } from "../../utils/storage";
import Draggable from "./../Draggable";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface WardrobeWindowProps {
  isFullscreen?: boolean;
  isMobile?: boolean;
}

type FurnitureType =
  | "wardrobe"
  | "hanger"
  | "shoeShelf"
  | "jewelryBox"
  | "floor";

type ItemSizes = {
  [key: string]: { width: number; height: number };
};

const WardrobeWindow: React.FC<WardrobeWindowProps> = ({
  isFullscreen = false,
  isMobile = false,
}) => {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [itemPositions, setItemPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [itemSizes, setItemSizes] = useState<ItemSizes>({});
  const [currentView, setCurrentView] = useState<FurnitureType | null>(null);
  const [furnitureBounds, setFurnitureBounds] = useState<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // FIXED: Room-level bounds for true free movement
  const [roomBounds, setRoomBounds] = useState({
    width: 650, // Default, will be measured
    height: 400,
  });
  const [containerBounds, setContainerBounds] = useState<{
    [key: string]: { width: number; height: number };
  }>({
    wardrobe: { width: 300, height: 350 },
    shoeShelf: { width: 250, height: 200 },
    jewelryBox: { width: 200, height: 150 },
    hanger: { width: 280, height: 300 },
  });

  // Refs
  const roomLayoutRef = useRef<View>(null);
  const floorAreaRef = useRef<View>(null);
  const wardrobeRef = useRef<View>(null);
  const jewelryBoxRef = useRef<View>(null);
  const hangerRef = useRef<View>(null);
  const shoeShelfRef = useRef<View>(null);

  // Furniture interior refs
  const wardrobeInteriorRef = useRef<View>(null);
  const shoeRackInteriorRef = useRef<View>(null);
  const jewelryBoxInteriorRef = useRef<View>(null);
  const hangerInteriorRef = useRef<View>(null);

  // FIXED: Track floor offset for proper positioning
  const [floorOffset, setFloorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadWardrobeItems();
    setTimeout(() => {
      measureAllBounds();
    }, 300);
  }, [currentView]);

  useEffect(() => {
    if (!currentView) {
      setSelectedItem(null);
    }
  }, [currentView]);

  // FIXED: Proper room-level measurement
  const measureAllBounds = () => {
    setTimeout(() => {
      // Measure the entire room layout first
      if (roomLayoutRef.current) {
        roomLayoutRef.current.measure((x, y, width, height) => {
          console.log("📐 Room Layout:", { width, height });
          if (width > 0 && height > 0) {
            setRoomBounds({ width, height });
          }
        });
      }

      // Measure floor area position relative to room
      if (floorAreaRef.current && roomLayoutRef.current) {
        floorAreaRef.current.measure((fx, fy, fw, fh, fpx, fpy) => {
          roomLayoutRef.current?.measure((rx, ry, rw, rh, rpx, rpy) => {
            const relativeX = fpx - rpx;
            const relativeY = fpy - rpy;
            setFloorOffset({ x: relativeX, y: relativeY });
            console.log("📐 Floor Offset:", { x: relativeX, y: relativeY });
          });
        });
      }

      // Measure furniture positions relative to room
      const measureFurniturePosition = (
        ref: React.RefObject<View | null>,
        furnitureType: string
      ) => {
        if (ref.current && roomLayoutRef.current) {
          ref.current.measure((fx, fy, fw, fh, fpx, fpy) => {
            roomLayoutRef.current?.measure((rx, ry, rw, rh, rpx, rpy) => {
              const relativeX = fpx - rpx;
              const relativeY = fpy - rpy;
              setFurnitureBounds((prev) => ({
                ...prev,
                [furnitureType]: {
                  x: relativeX,
                  y: relativeY,
                  width: fw,
                  height: fh,
                },
              }));
              console.log(`🏠 ${furnitureType} Position:`, {
                x: relativeX,
                y: relativeY,
                width: fw,
                height: fh,
              });
            });
          });
        }
      };

      measureFurniturePosition(wardrobeRef, "wardrobe");
      measureFurniturePosition(jewelryBoxRef, "jewelryBox");
      measureFurniturePosition(hangerRef, "hanger");
      measureFurniturePosition(shoeShelfRef, "shoeShelf");

      // Measure furniture interiors
      const measureContainer = (
        ref: React.RefObject<View | null>,
        container: string
      ) => {
        if (ref.current) {
          ref.current.measure((x, y, width, height) => {
            if (width > 0 && height > 0) {
              setContainerBounds((prev) => ({
                ...prev,
                [container]: { width, height },
              }));
            }
          });
        }
      };

      measureContainer(wardrobeInteriorRef, "wardrobe");
      measureContainer(shoeRackInteriorRef, "shoeShelf");
      measureContainer(jewelryBoxInteriorRef, "jewelryBox");
      measureContainer(hangerInteriorRef, "hanger");
    }, 400);
  };

  const loadWardrobeItems = async () => {
    try {
      const items = await wardrobeStorage.getItems();
      console.log("🔄 Loaded items:", items.length);

      setWardrobeItems(items);

      const initialPositions: { [key: string]: { x: number; y: number } } = {};
      const initialSizes: ItemSizes = {};

      items.forEach((item) => {
        if (item.position) {
          initialPositions[item.id] = item.position;
        } else if (!item.placedIn || item.placedIn === "floor") {
          const floorItemCount = Object.keys(initialPositions).filter(
            (id) =>
              !items.find((i) => i.id === id)?.placedIn ||
              items.find((i) => i.id === id)?.placedIn === "floor"
          ).length;

          // Push initial floor spawns lower by adding a vertical offset
          const SPAWN_Y_OFFSET = 300; // increase to move items further down
          const baseFloorY = floorOffset.y + SPAWN_Y_OFFSET;

          initialPositions[item.id] = {
            x: 20 + (floorItemCount % 6) * 70,
            y: baseFloorY + Math.floor(floorItemCount / 6) * 75,
          };
        }

        if (item.customSize) {
          initialSizes[item.id] = item.customSize;
        } else {
          const container =
            (item.placedIn as FurnitureType | undefined) ?? "floor";
          initialSizes[item.id] = getDefaultSizeForContainer(container);
        }
      });

      setItemPositions(initialPositions);
      setItemSizes(initialSizes);
    } catch (error) {
      console.error("❌ Failed to load items:", error);
    }
  };

  const getDefaultSizeForContainer = (container: FurnitureType) => {
    const defaultSizes = {
      floor: { width: 60, height: 60 },
      wardrobe: { width: 60, height: 60 },
      shoeShelf: { width: 50, height: 50 },
      jewelryBox: { width: 40, height: 40 },
      hanger: { width: 60, height: 80 },
    };
    return defaultSizes[container];
  };

  // REPLACE JUST THIS FUNCTION - keep everything else the same
  const handleItemDrag = async (
    itemId: string,
    position: { x: number; y: number },
    container: FurnitureType = "floor"
  ) => {
    const item = wardrobeItems.find((i) => i.id === itemId);
    if (!item) return;

    const currentSize =
      itemSizes[item.id] || getDefaultSizeForContainer(container);
    const { width: itemWidth, height: itemHeight } = currentSize;

    let clampedPosition = position;
    let placedIn: FurnitureType = container;

    console.log(`📦 Dragging in ${container}:`, {
      position,
      roomBounds,
      itemSize: currentSize,
    });

    if (container === "floor") {
      // Floor dragging logic - unchanged
      clampedPosition = {
        x: Math.max(0, Math.min(position.x, roomBounds.width - itemWidth)),
        y: Math.max(0, Math.min(position.y, roomBounds.height - itemHeight)),
      };

      Object.entries(furnitureBounds).forEach(
        ([furnitureType, furnitureRect]) => {
          if (
            clampedPosition.x >= furnitureRect.x &&
            clampedPosition.x <= furnitureRect.x + furnitureRect.width &&
            clampedPosition.y >= furnitureRect.y &&
            clampedPosition.y <= furnitureRect.y + furnitureRect.height
          ) {
            placedIn = furnitureType as FurnitureType;
            console.log(`🎯 Item placed in ${placedIn}`);

            const furnitureInteriorBounds = containerBounds[placedIn];
            if (furnitureInteriorBounds) {
              clampedPosition = {
                x: Math.max(0, (furnitureInteriorBounds.width - itemWidth) / 2),
                y: Math.max(
                  0,
                  (furnitureInteriorBounds.height - itemHeight) / 2
                ),
              };
            }
          }
        }
      );
    } else {
      // FURNITURE INTERIOR: NO BOUNDS AT ALL - use position exactly as given
      clampedPosition = {
        x: position.x,
        y: position.y,
      };
    }

    // Update item placement and position
    const updatedItems = wardrobeItems.map((i) =>
      i.id === itemId ? { ...i, placedIn, position: clampedPosition } : i
    );

    setWardrobeItems(updatedItems);
    await wardrobeStorage.updateItems(updatedItems);

    setItemPositions((prev) => ({
      ...prev,
      [itemId]: clampedPosition,
    }));
  };

  const handleResizeItem = async (
    itemId: string,
    direction: "increase" | "decrease"
  ) => {
    const currentSize =
      itemSizes[itemId] || getDefaultSizeForContainer("floor");
    const scaleFactor = direction === "increase" ? 1.2 : 0.8;

    const newSize = {
      width: Math.max(20, Math.min(150, currentSize.width * scaleFactor)),
      height: Math.max(20, Math.min(150, currentSize.height * scaleFactor)),
    };

    setItemSizes((prev) => ({
      ...prev,
      [itemId]: newSize,
    }));

    const updatedItems = wardrobeItems.map((item) =>
      item.id === itemId ? { ...item, customSize: newSize } : item
    );

    setWardrobeItems(updatedItems);
    await wardrobeStorage.updateItems(updatedItems);
  };

  const handleItemSelect = (itemId: string) => {
    if (isDeleteMode) {
      setItemToDelete(itemId);
      setDeleteModalVisible(true);
      setIsDeleteMode(false);
    } else {
      setSelectedItem(itemId === selectedItem ? null : itemId);
    }
  };

  const renderResizeControls = (
    itemId: string,
    position: { x: number; y: number }
  ) => {
    if (selectedItem !== itemId) return null;

    return (
      <View style={resizeStyles.resizeControls} pointerEvents="box-none">
        <TouchableOpacity
          style={[resizeStyles.resizeButton, resizeStyles.decreaseButton]}
          onPress={() => handleResizeItem(itemId, "decrease")}
        >
          <Text style={resizeStyles.resizeButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[resizeStyles.resizeButton, resizeStyles.increaseButton]}
          onPress={() => handleResizeItem(itemId, "increase")}
        >
          <Text style={resizeStyles.resizeButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleFurniturePress = (furnitureType: FurnitureType) => {
    setCurrentView(furnitureType);
    setSelectedItem(null);
    setTimeout(measureAllBounds, 100);
  };

  const handleTrashBinPress = () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      setSelectedItem(null);
    } else {
      setIsDeleteMode(false);
    }
  };

  const handleTakeItemOut = async (itemId: string) => {
    const item = wardrobeItems.find((i) => i.id === itemId);
    if (item) {
      const floorItemCount = wardrobeItems.filter(
        (i) => !i.placedIn || i.placedIn === "floor"
      ).length;

      const SPAWN_Y_OFFSET = 100; // increase to move items further down
      const baseFloorY = floorOffset.y + SPAWN_Y_OFFSET;

      const newPosition = {
        x: 50 + (floorItemCount % 5) * 70,
        y: baseFloorY + Math.floor(floorItemCount / 5) * 75,
      };

      const updatedItems = wardrobeItems.map((i) =>
        i.id === itemId
          ? { ...i, placedIn: "floor" as FurnitureType, position: newPosition }
          : i
      );

      setWardrobeItems(updatedItems);
      await wardrobeStorage.updateItems(updatedItems);
      setItemPositions((prev) => ({
        ...prev,
        [itemId]: newPosition,
      }));
    }
  };

  const handleItemLongPress = (itemId: string) => {
    handleTakeItemOut(itemId);
  };

  const getItemsForFurniture = (furnitureType: FurnitureType) => {
    return wardrobeItems.filter((item) => item.placedIn === furnitureType);
  };

  const getFloorItems = () => {
    return wardrobeItems.filter(
      (item) =>
        (!item.placedIn || item.placedIn === "floor") && itemPositions[item.id]
    );
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await wardrobeStorage.deleteItem(itemToDelete);
      await loadWardrobeItems();
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  // Furniture views (unchanged)
  const renderWardrobeView = () => (
    <View style={styles.furnitureView}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>Wardrobe</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.wardrobeInterior} ref={wardrobeInteriorRef}>
        <Image
          source={require("../../assets/furniture/wardrobe-open.png")}
          style={styles.furnitureBackground}
        />

        {getItemsForFurniture("wardrobe").map((item) => {
          const currentSize =
            itemSizes[item.id] || getDefaultSizeForContainer("wardrobe");
          return (
            <Draggable
              key={item.id}
              initialPosition={itemPositions[item.id] || { x: 50, y: 50 }}
              onDrag={(position) =>
                handleItemDrag(item.id, position, "wardrobe")
              }
            >
              <TouchableOpacity
                onPress={() => handleItemSelect(item.id)}
                onLongPress={() => handleItemLongPress(item.id)}
                delayLongPress={500}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={[
                    styles.wardrobeItemImage,
                    { width: currentSize.width, height: currentSize.height },
                  ]}
                />
              </TouchableOpacity>
              {renderResizeControls(
                item.id,
                itemPositions[item.id] || { x: 50, y: 50 }
              )}
            </Draggable>
          );
        })}
      </View>
    </View>
  );

  const renderHangerView = () => (
    <View style={styles.furnitureView}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>Hanger Rack</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.hangerInterior} ref={hangerInteriorRef}>
        <Image
          source={require("../../assets/furniture/hanger-rack.png")}
          style={styles.hangerRackImage}
        />

        {getItemsForFurniture("hanger").map((item) => {
          const currentSize =
            itemSizes[item.id] || getDefaultSizeForContainer("hanger");
          return (
            <Draggable
              key={item.id}
              initialPosition={itemPositions[item.id] || { x: 50, y: 80 }}
              onDrag={(position) => handleItemDrag(item.id, position, "hanger")}
            >
              <TouchableOpacity
                onPress={() => handleItemSelect(item.id)}
                onLongPress={() => handleItemLongPress(item.id)}
                delayLongPress={500}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={[
                    styles.hangerItemImage,
                    { width: currentSize.width, height: currentSize.height },
                  ]}
                />
              </TouchableOpacity>
              {renderResizeControls(
                item.id,
                itemPositions[item.id] || { x: 50, y: 80 }
              )}
            </Draggable>
          );
        })}
      </View>
    </View>
  );

  const renderShoeShelfView = () => (
    <View style={styles.furnitureView}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>Shoe Rack</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.shoeRackInterior} ref={shoeRackInteriorRef}>
        <Image
          source={require("../../assets/furniture/shoe-rack-open.png")}
          style={styles.furnitureBackground}
        />

        {getItemsForFurniture("shoeShelf").map((item) => {
          const currentSize =
            itemSizes[item.id] || getDefaultSizeForContainer("shoeShelf");
          return (
            <Draggable
              key={item.id}
              initialPosition={itemPositions[item.id] || { x: 50, y: 50 }}
              onDrag={(position) =>
                handleItemDrag(item.id, position, "shoeShelf")
              }
            >
              <TouchableOpacity
                onPress={() => handleItemSelect(item.id)}
                onLongPress={() => handleItemLongPress(item.id)}
                delayLongPress={500}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={[
                    styles.shoeItemImage,
                    { width: currentSize.width, height: currentSize.height },
                  ]}
                />
              </TouchableOpacity>
              {renderResizeControls(
                item.id,
                itemPositions[item.id] || { x: 50, y: 50 }
              )}
            </Draggable>
          );
        })}
      </View>
    </View>
  );

  const renderJewelryBoxView = () => (
    <View style={styles.furnitureView}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView(null)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>Jewelry Box</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.jewelryBoxInterior} ref={jewelryBoxInteriorRef}>
        <Image
          source={require("../../assets/furniture/jewelry-box-open.png")}
          style={styles.furnitureBackground}
        />

        {getItemsForFurniture("jewelryBox").map((item) => {
          const currentSize =
            itemSizes[item.id] || getDefaultSizeForContainer("jewelryBox");
          return (
            <Draggable
              key={item.id}
              initialPosition={itemPositions[item.id] || { x: 50, y: 50 }}
              onDrag={(position) =>
                handleItemDrag(item.id, position, "jewelryBox")
              }
            >
              <TouchableOpacity
                onPress={() => handleItemSelect(item.id)}
                onLongPress={() => handleItemLongPress(item.id)}
                delayLongPress={500}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={[
                    styles.jewelryItemImage,
                    { width: currentSize.width, height: currentSize.height },
                  ]}
                />
              </TouchableOpacity>
              {renderResizeControls(
                item.id,
                itemPositions[item.id] || { x: 50, y: 50 }
              )}
            </Draggable>
          );
        })}
      </View>
    </View>
  );

  const mobilePreviewContent = (
    <View style={windowStyles.previewContent}>
      <Image
        source={require("../../assets/icons/wardrobe.png")}
        style={windowStyles.previewIcon}
      />
      <Text style={windowStyles.previewTitle}>My Room</Text>
      <Text style={windowStyles.previewText}>
        Organize your clothes in furniture{"\n"}Click furniture to see inside!
      </Text>
      <View style={windowStyles.previewStats}>
        <Text style={windowStyles.statsText}>
          Items: {wardrobeItems.length}
        </Text>
      </View>
    </View>
  );

  // FIXED: The main structural change - floor items at room level
  const fullContent = (
    <View style={windowStyles.fullContent}>
      <Text style={windowStyles.fullSubtitle}>
        Drag items onto furniture to store them.
        {!currentView && !isDeleteMode && " Click furniture to see inside."}
        {isDeleteMode && " Click an item to delete it."}
        {currentView &&
          " Click items to select and resize them. Long press to take out."}
      </Text>

      {currentView ? (
        <>
          {currentView === "wardrobe" && renderWardrobeView()}
          {currentView === "hanger" && renderHangerView()}
          {currentView === "shoeShelf" && renderShoeShelfView()}
          {currentView === "jewelryBox" && renderJewelryBoxView()}
        </>
      ) : (
        <View style={windowStyles.roomLayout} ref={roomLayoutRef}>
          <TouchableOpacity
            style={windowStyles.trashBin}
            onPress={handleTrashBinPress}
          >
            <Image
              source={require("../../assets/icons/trash-icon.png")}
              style={windowStyles.trashBinIcon}
            />
          </TouchableOpacity>

          <View style={windowStyles.furnitureRow}>
            <TouchableOpacity
              ref={wardrobeRef}
              onPress={() => handleFurniturePress("wardrobe")}
            >
              <Image
                source={require("../../assets/furniture/wardrobe-closed.png")}
                style={[windowStyles.furnitureImage, windowStyles.wardrobeSize]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              ref={jewelryBoxRef}
              onPress={() => handleFurniturePress("jewelryBox")}
            >
              <Image
                source={require("../../assets/furniture/jewelry-box-closed.png")}
                style={[
                  windowStyles.furnitureImage,
                  windowStyles.jewelryBoxSize,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              ref={hangerRef}
              onPress={() => handleFurniturePress("hanger")}
            >
              <Image
                source={require("../../assets/furniture/hanger-closed.png")}
                style={[windowStyles.furnitureImage, windowStyles.hangerSize]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              ref={shoeShelfRef}
              onPress={() => handleFurniturePress("shoeShelf")}
            >
              <Image
                source={require("../../assets/furniture/shoe-rack-closed.png")}
                style={[
                  windowStyles.furnitureImage,
                  windowStyles.shoeShelfSize,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Floor area - just the visual background */}
          <View style={windowStyles.floorArea} ref={floorAreaRef}>
            <Image
              source={require("../../assets/floor-texture.png")}
              style={windowStyles.floorTexture}
              resizeMode="repeat"
            />

            {/* Empty state only */}
            {wardrobeItems.length === 0 && (
              <View style={windowStyles.emptyFloor}>
                <Text style={windowStyles.emptyText}>No items yet</Text>
                <Text style={windowStyles.emptySubtext}>
                  To add items go to the Add Items window! Have fun!
                </Text>
              </View>
            )}
          </View>

          {/* FIXED: Floor items rendered at room level for true free movement */}
          {getFloorItems().map((item) => {
            const currentSize =
              itemSizes[item.id] || getDefaultSizeForContainer("floor");
            return (
              <Draggable
                key={item.id}
                initialPosition={itemPositions[item.id] || { x: 50, y: 150 }}
                onDrag={(position) =>
                  handleItemDrag(item.id, position, "floor")
                }
              >
                <TouchableOpacity
                  style={[
                    windowStyles.draggableItem,
                    { width: currentSize.width, height: currentSize.height },
                  ]}
                  onPress={() => handleItemSelect(item.id)}
                >
                  <Image
                    source={{ uri: item.imageUri }}
                    style={[
                      windowStyles.itemImage,
                      { width: currentSize.width, height: currentSize.height },
                    ]}
                  />
                </TouchableOpacity>
                {renderResizeControls(
                  item.id,
                  itemPositions[item.id] || { x: 50, y: 150 }
                )}
              </Draggable>
            );
          })}
        </View>
      )}

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={windowStyles.modalOverlay}>
          <View style={windowStyles.modalContent}>
            <Text style={windowStyles.modalTitle}>Delete Item</Text>
            <Text style={windowStyles.modalText}>
              Are you sure you want to delete this item?
            </Text>
            <View style={windowStyles.modalButtons}>
              <TouchableOpacity
                style={[windowStyles.modalButton, windowStyles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={windowStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[windowStyles.modalButton, windowStyles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={windowStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return isMobile && !isFullscreen ? mobilePreviewContent : fullContent;
};

// ... (rest of the styles remain the same)

const resizeStyles = StyleSheet.create({
  resizeControls: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  resizeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
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
    fontSize: 14,
    lineHeight: 18,
  },
});

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
    backgroundColor: "transparent",
  },
  fullSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  roomLayout: {
    flex: 1,
    position: "relative", // Important for absolute positioning of floor items
  },
  furnitureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
    height: 150,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  furnitureImage: {
    resizeMode: "contain",
  },
  wardrobeSize: {
    width: 180,
    height: 160,
  },
  jewelryBoxSize: {
    width: 100,
    height: 80,
  },
  hangerSize: {
    width: 130,
    height: 100,
  },
  shoeShelfSize: {
    width: 90,
    height: 70,
  },
  // Floor area is now just a visual background
  floorArea: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    minHeight: 300,
  },
  floorTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  draggableItem: {
    position: "absolute",
    alignItems: "center",
    padding: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  itemImage: {
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  emptyFloor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#666",
  },
  trashBin: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    borderRadius: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  trashBinIcon: {
    width: 40,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxWidth: 300,
    borderWidth: 2,
    borderColor: "#c0c0c0",
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    borderWidth: 2,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#cc0000",
    borderBottomColor: "#cc0000",
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  furnitureView: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#c0c0c0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 2,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#808080",
    borderBottomColor: "#808080",
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  viewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  placeholder: {
    width: 60,
  },
  furnitureBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "contain",
  },
  wardrobeInterior: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  shoeRackInterior: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  jewelryBoxInterior: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  hangerInterior: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  hangerRackImage: {
    width: "100%",
    height: "100%",
    position: "relative",
    resizeMode: "contain",
  },
  wardrobeItemImage: {
    backgroundColor: "transparent",
  },
  shoeItemImage: {
    backgroundColor: "transparent",
  },
  jewelryItemImage: {
    backgroundColor: "transparent",
  },
  hangerItemImage: {
    backgroundColor: "transparent",
  },
});

export default WardrobeWindow;
