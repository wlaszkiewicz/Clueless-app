import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Text,
} from "react-native";

interface SimpleDraggableProps {
  children: React.ReactNode;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const SimpleDraggable: React.FC<SimpleDraggableProps> = ({
  children,
  onPositionChange,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (dx: number, dy: number) => {
    const newPosition = {
      x: position.x + dx,
      y: position.y + dy,
    };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  return (
    <View
      style={[
        styles.container,
        { transform: [{ translateX: position.x }, { translateY: position.y }] },
      ]}
    >
      <TouchableOpacity
        style={styles.draggable}
        onPressIn={() => setIsDragging(true)}
        onPressOut={() => setIsDragging(false)}
        delayLongPress={100}
        onLongPress={() => {
          /* Start drag */
        }}
      >
        {children}
      </TouchableOpacity>
      {isDragging && (
        <View style={styles.dragOverlay}>
          <Text style={styles.dragText}>Drag me!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  draggable: {
    // TouchableOpacity handles the touch
  },
  dragOverlay: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  dragText: {
    fontSize: 10,
    color: "#0000ff",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 4,
    borderRadius: 4,
  },
});

export default SimpleDraggable;
