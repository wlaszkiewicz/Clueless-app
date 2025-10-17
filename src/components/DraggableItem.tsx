import React, { useState } from "react";
import { View, PanResponder, StyleSheet } from "react-native";

interface DraggableItemProps {
  children: React.ReactNode;
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition?: { x: number; y: number };
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  children,
  onDrag,
  initialPosition = { x: 0, y: 0 },
}) => {
  const [position, setPosition] = useState(initialPosition);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = {
        x: initialPosition.x + gestureState.dx,
        y: initialPosition.y + gestureState.dy,
      };
      setPosition(newPosition);
      onDrag(newPosition);
    },
  });

  return (
    <View
      style={[
        styles.draggable,
        { transform: [{ translateX: position.x }, { translateY: position.y }] },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  draggable: {
    position: "absolute",
  },
});

export default DraggableItem;
