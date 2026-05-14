import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  description?: string;
  category: string;
  due_date?: string;
  priority?: string;
  reminder?: string;
  repeat?: string;
  is_completed?: boolean;
};

type TasksContextData = {
  tasks: Task[];
  isLoading: boolean;
  categories: string[];
  fetchTasks: () => Promise<void>;
  addCategory: (category: string) => void;
  handleSaveTask: (taskData: any, mode: 'create' | 'edit', selectedTaskId?: string) => Promise<void>;
  handleDeleteTask: (id: string) => Promise<void>;
  handleToggleComplete: (id: string, currentStatus: boolean) => Promise<void>;
  clearTasksData: () => void;
};

const INITIAL_CATEGORIES = ["Todos", "Trabalhos", "Pessoal", "Dia a dia", "Teste", "Outro"];

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  useEffect(() => {
    const loadSavedCategories = async () => {
      try {
        const saved = await AsyncStorage.getItem('@TaskCycle:categories');
        if (saved) {
          setCategories(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Erro ao carregar categorias do storage", error);
      }
    };
    loadSavedCategories();
  }, []);

  const addCategory = useCallback(async (newCategory: string) => {
    const formatted = newCategory.trim();
    if (formatted && !categories.includes(formatted)) {
      const updatedCategories = [...categories, formatted];
      setCategories(updatedCategories);
      try {
        await AsyncStorage.setItem('@TaskCycle:categories', JSON.stringify(updatedCategories));
      } catch (e) {
        console.warn("Erro silencioso no AsyncStorage:", e);
      }
    }
  }, [categories]);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      if (response.data && response.data.data) {
        const fetchedTasks = response.data.data;
        setTasks(fetchedTasks);

        // Extrair categorias existentes das tarefas vindas do banco
        setCategories(prev => {
          const unique = new Set(prev);
          fetchedTasks.forEach((t: Task) => {
            if (t.category && t.category !== "Sem categoria") {
              unique.add(t.category);
            }
          });
          const merged = Array.from(unique);
          if (merged.length !== prev.length) {
            AsyncStorage.setItem('@TaskCycle:categories', JSON.stringify(merged)).catch(e => {
              console.warn("Erro silencioso ao salvar categorias no AsyncStorage:", e);
            });
            return merged;
          }
          return prev;
        });
      }
    } catch (error) {
      console.log("Erro ao buscar tarefas", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveTask = async (taskData: any, mode: 'create' | 'edit', selectedTaskId?: string) => {
    try {
      const taskCategory = taskData.category === "Sem categoria" ? "Todos" : taskData.category;
      
      const payload = {
        title: taskData.title,
        description: taskData.description || taskData.title,
        category: taskCategory,
        due_date: taskData.dateStr || null,
        priority: taskData.priority,
        reminder: taskData.reminder,
        repeat: taskData.repeat,
        is_completed: false,
      };

      if (mode === "edit" && selectedTaskId) {
        // Optimistic update
        setTasks(prev => prev.map(t => String(t.id) === String(selectedTaskId) ? { ...t, ...payload } : t));
        await api.put(`/tasks/${selectedTaskId}`, payload);
      } else {
        const response = await api.post("/tasks", payload);
        const newTask = response.data?.data || { id: Math.random().toString(), ...payload };
        setTasks(prev => [newTask, ...prev]);
      }

      if (taskCategory !== "Todos") {
        addCategory(taskCategory);
      }
    } catch (error) {
      console.log("Erro ao salvar tarefa", error);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
      fetchTasks(); // Revert
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setTasks(prev => prev.filter(t => String(t.id) !== String(id)));
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.log("Erro ao deletar", error);
      fetchTasks();
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      setTasks(prev => prev.map(t => String(t.id) === String(id) ? { ...t, is_completed: !currentStatus } : t));
      await api.put(`/tasks/${id}`, { is_completed: !currentStatus });
    } catch (error) {
      console.log("Erro ao atualizar status", error);
      fetchTasks();
    }
  };

  const clearTasksData = useCallback(() => {
    setTasks([]);
    setCategories(INITIAL_CATEGORIES);
  }, []);

  return (
    <TasksContext.Provider value={{
      tasks, isLoading, categories, fetchTasks, addCategory,
      handleSaveTask, handleDeleteTask, handleToggleComplete, clearTasksData
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
