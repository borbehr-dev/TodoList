import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type FilterType = "all" | "active" | "done";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoContextType {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | null>(null);
const STORAGE_KEY = "@todos_v1";

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setTodos(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const saveTodos = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
  }, []);

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id:
          Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      saveTodos([newTodo, ...todos]);
    },
    [todos, saveTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      saveTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [todos, saveTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      saveTodos(todos.filter((t) => t.id !== id));
    },
    [todos, saveTodos]
  );

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  return (
    <TodoContext.Provider
      value={{
        todos,
        filter,
        setFilter,
        addTodo,
        toggleTodo,
        deleteTodo,
        filteredTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
}
