import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Window3D from "../components/Window3D";
import { Theme } from "../constants/Theme";

const WardrobeScreen = ({ onClose }: { onClose: () => void }) => {
  const [clothingItems, setClothingItems] = useState<any[]>([]);

  return (
    <Window3D title="My Wardrobe - Clueless" onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.itemsGrid}>
          {clothingItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No clothing items yet!</Text>
              <Text style={styles.emptySubtext}>
                Click "Add Item" to start building your wardrobe.
              </Text>
            </View>
          ) : (
            clothingItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {clothingItems.length} items • Ready
          </Text>
        </View>
      </View>
    </Window3D>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    marginBottom: Theme.spacing.medium,
  },
  toolbarButton: {
    backgroundColor: Theme.colors.window,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderTopColor: Theme.colors.borderLight,
    borderLeftColor: Theme.colors.borderLight,
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small,
    marginRight: Theme.spacing.small,
  },
  buttonText: {
    fontFamily: "System",
    fontSize: 11,
    color: Theme.colors.text,
  },
  itemsGrid: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: Theme.spacing.large,
  },
  emptyText: {
    fontFamily: "System",
    fontSize: 14,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.small,
  },
  emptySubtext: {
    fontFamily: "System",
    fontSize: 11,
    color: Theme.colors.text,
    textAlign: "center",
  },
  itemCard: {
    width: 100,
    margin: Theme.spacing.small,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    marginBottom: 4,
  },
  itemName: {
    fontFamily: "System",
    fontSize: 10,
    color: Theme.colors.text,
    textAlign: "center",
  },
  statusBar: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderDark,
    paddingTop: Theme.spacing.small,
    marginTop: Theme.spacing.medium,
  },
  statusText: {
    fontFamily: "System",
    fontSize: 10,
    color: Theme.colors.text,
  },
});

export default WardrobeScreen;
