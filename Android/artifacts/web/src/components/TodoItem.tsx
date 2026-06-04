import { useCallback } from "react";

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

  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const handleDelete = useCallback(() => {
    onDelete();
  }, [onDelete]);

  return (
    <div
      className="todo-item"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <button
        onClick={handleToggle}
        className="checkbox-area"
        style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
      >
        <div
          className="checkbox"
          style={{
            borderColor: todo.completed ? colors.primary : colors.border,
            backgroundColor: todo.completed ? colors.primary : "transparent",
          }}
        >
          {todo.completed && (
            <CheckIcon size={11} color="#fff" strokeWidth={3} />
          )}
        </div>
      </button>

      <span
        className="text"
        style={{
          color: todo.completed ? colors.mutedForeground : colors.foreground,
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.text}
      </span>

      <button
        onClick={handleDelete}
        className="delete-btn"
        style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
      >
        <TrashIcon size={15} color={colors.mutedForeground} />
      </button>
    </div>
  );
}
