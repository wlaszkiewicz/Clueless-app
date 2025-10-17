import React, { useState, useRef } from "react";
import { PanResponder, View, StyleSheet } from "react-native";

interface DraggableProps {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onDrag?: (position: { x: number; y: number }) => void;
  onDoubleClick?: () => void;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  initialPosition = { x: 0, y: 0 },
  onDrag,
  onDoubleClick,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const viewRef = useRef<View>(null);
  const lastTapRef = useRef<number>(0);

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected!
      onDoubleClick?.();
      lastTapRef.current = 0;
    } else {
      // Single tap
      lastTapRef.current = now;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Bring to front - we'll handle this in parent
    },
    onPanResponderMove: (_, gestureState) => {
      const newPosition = {
        x: initialPosition.x + gestureState.dx,
        y: initialPosition.y + gestureState.dy,
      };
      setPosition(newPosition);
      onDrag?.(newPosition);
    },
    onPanResponderRelease: () => {
      // Drag ended
    },
  });

  return (
    <View
      ref={viewRef}
      style={[
        styles.draggable,
        {
          transform: [{ translateX: position.x }, { translateY: position.y }],
        },
      ]}
      {...panResponder.panHandlers}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handlePress}
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

export default Draggable;
