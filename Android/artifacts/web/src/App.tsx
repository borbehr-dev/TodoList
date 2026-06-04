import { useRef, useState } from "react";

import { ArrowUpIcon, CheckCircleIcon, PlusIcon } from "@/components/Icons";
import { TodoItem } from "@/components/TodoItem";
import { FilterType, useTodos } from "@/context/TodoContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Готово", value: "done" },
];

export default function App() {
  const colors = useColors();
  const { todos, filteredTodos, filter, setFilter, addTodo, toggleTodo, deleteTodo } =
    useTodos();
  const [inputText, setInputText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const completedCount = todos.filter((t: any) => t.completed).length;

  const handleAdd = () => {
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText("");
    }
  };

  const handleFABPress = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleDismiss = () => {
    setShowInput(false);
    setInputText("");
  };

  return (
    <div
      className="root"
      style={{ backgroundColor: colors.background }}
    >
      <div className="header">
        <div>
          <div
            className="subtitle"
            style={{ color: colors.mutedForeground }}
          >
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="title" style={{ color: colors.foreground }}>
            Мои задачи
          </div>
        </div>
        {todos.length > 0 && (
          <div
            className="badge"
            style={{ backgroundColor: colors.secondary }}
          >
            <span className="badge-text" style={{ color: colors.primary }}>
              {completedCount}/{todos.length}
            </span>
          </div>
        )}
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className="filter-chip"
            style={{
              borderColor: colors.border,
              backgroundColor: filter === f.value ? colors.primary : "transparent",
              color: filter === f.value ? "#fff" : colors.mutedForeground,
            }}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <CheckCircleIcon size={52} color={colors.border} />
            <div className="empty-title" style={{ color: colors.mutedForeground }}>
              {filter === "done"
                ? "Нет выполненных задач"
                : filter === "active"
                ? "Всё сделано!"
                : "Пока ничего нет"}
            </div>
            {filter === "all" && (
              <div className="empty-hint" style={{ color: colors.border }}>
                Нажми + чтобы добавить первую задачу
              </div>
            )}
          </div>
        ) : (
          filteredTodos.map((item) => (
            <TodoItem
              key={item.id}
              todo={item}
              onToggle={() => toggleTodo(item.id)}
              onDelete={() => deleteTodo(item.id)}
            />
          ))
        )}
      </div>

      {showInput && (
        <div
          className="input-sheet"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <div className="input-row">
            <input
              ref={inputRef}
              className="input"
              style={{
                color: colors.foreground,
              }}
              placeholder="Что нужно сделать?"
              value={inputText}
              onChange={(e: any) => setInputText(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") handleAdd();
              }}
              autoFocus
            />
            <button
              className="add-btn"
              style={{
                backgroundColor: inputText.trim()
                  ? colors.primary
                  : colors.muted,
              }}
              onClick={handleAdd}
              disabled={!inputText.trim()}
            >
              <ArrowUpIcon
                size={18}
                color={inputText.trim() ? "#fff" : colors.mutedForeground}
              />
            </button>
          </div>
          <button className="dismiss" onClick={handleDismiss}>
            <span className="dismiss-text" style={{ color: colors.mutedForeground }}>
              Закрыть
            </span>
          </button>
        </div>
      )}

      {!showInput && (
        <div
          className="fab"
          style={{ backgroundColor: colors.primary }}
        >
          <button className="fab-inner" onClick={handleFABPress}>
            <PlusIcon size={26} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
}
