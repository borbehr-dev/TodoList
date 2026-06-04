import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArrowUpIcon, CheckCircleIcon, PlusIcon } from "@/components/Icons";
import { TodoItem } from "@/components/TodoItem";
import { FilterType, useTodos } from "@/context/TodoContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Готово", value: "done" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { todos, filteredTodos, filter, setFilter, addTodo, toggleTodo, deleteTodo } =
    useTodos();
  const [inputText, setInputText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const completedCount = todos.filter((t) => t.completed).length;
  const isWeb = Platform.OS === "web";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  const handleAdd = () => {
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleFABPress = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 80);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDismiss = () => {
    setShowInput(false);
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <View>
          <Text
            style={[styles.subtitle, { color: colors.mutedForeground }]}
          >
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Мои задачи
          </Text>
        </View>
        {todos.length > 0 && (
          <Animated.View
            entering={FadeIn}
            style={[styles.badge, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {completedCount}/{todos.length}
            </Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filter === f.value && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setFilter(f.value)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === f.value ? "#fff" : colors.mutedForeground,
                  fontFamily:
                    filter === f.value
                      ? "Inter_600SemiBold"
                      : "Inter_400Regular",
                },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => deleteTodo(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomInset + 110 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CheckCircleIcon size={52} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              {filter === "done"
                ? "Нет выполненных задач"
                : filter === "active"
                ? "Всё сделано!"
                : "Пока ничего нет"}
            </Text>
            {filter === "all" && (
              <Text style={[styles.emptyHint, { color: colors.border }]}>
                Нажми + чтобы добавить первую задачу
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {showInput && (
        <Animated.View
          entering={FadeInUp.springify().damping(24)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.inputSheet,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              paddingBottom: bottomInset + 10,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              placeholder="Что нужно сделать?"
              placeholderTextColor={colors.mutedForeground}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              blurOnSubmit={false}
              autoFocus
            />
            <Pressable
              style={[
                styles.addBtn,
                {
                  backgroundColor: inputText.trim()
                    ? colors.primary
                    : colors.muted,
                },
              ]}
              onPress={handleAdd}
              disabled={!inputText.trim()}
            >
              <ArrowUpIcon
                size={18}
                color={inputText.trim() ? "#fff" : colors.mutedForeground}
              />
            </Pressable>
          </View>
          <Pressable onPress={handleDismiss} style={styles.dismiss}>
            <Text style={[styles.dismissText, { color: colors.mutedForeground }]}>
              Закрыть
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {!showInput && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.fab,
            { bottom: bottomInset + 24, backgroundColor: colors.primary },
          ]}
        >
          <Pressable onPress={handleFABPress} style={styles.fabInner}>
            <PlusIcon size={26} color="#fff" />
          </Pressable>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
  },
  badge: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
  },
  list: {
    paddingTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 90,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  inputSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 18,
    paddingHorizontal: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dismiss: {
    alignItems: "center",
    paddingVertical: 6,
  },
  dismissText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  fabInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
