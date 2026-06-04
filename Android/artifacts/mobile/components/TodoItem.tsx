import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { CheckIcon, TrashIcon } from "@/components/Icons";
import { Todo } from "@/context/TodoContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggle = useCallback(() => {
    scale.value = withSpring(0.88, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  }, [onToggle, scale]);

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  }, [onDelete]);

  return (
    <Animated.View
      entering={FadeInLeft.springify().damping(22)}
      exiting={FadeOutRight.springify().damping(22)}
      layout={LinearTransition.springify().damping(20)}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Pressable onPress={handleToggle} style={styles.checkboxArea}>
        <Animated.View
          style={[
            styles.checkbox,
            { borderColor: todo.completed ? colors.primary : colors.border },
            todo.completed && { backgroundColor: colors.primary },
            animStyle,
          ]}
        >
          {todo.completed && (
            <CheckIcon size={11} color="#fff" strokeWidth={3} />
          )}
        </Animated.View>
      </Pressable>

      <Text
        style={[
          styles.text,
          { color: todo.completed ? colors.mutedForeground : colors.foreground },
          todo.completed && styles.completedText,
        ]}
        numberOfLines={2}
      >
        {todo.text}
      </Text>

      <Pressable onPress={handleDelete} style={styles.deleteBtn} hitSlop={10}>
        <TrashIcon size={15} color={colors.mutedForeground} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  checkboxArea: {
    marginRight: 12,
    padding: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 4,
  },
});
