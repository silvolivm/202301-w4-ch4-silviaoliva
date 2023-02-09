import { useState, useCallback, useMemo } from "react";
import { ProtoTaskStructure, TaskStructure } from "../models/task";
import { TaskApiRepo } from "../services/repository/task.api.repo";

export function useTasks() {
  const repo = useMemo(() => new TaskApiRepo(), []);
  const initialState: TaskStructure[] = [];

  const [tasks, setTasks] = useState(initialState);

  console.log("TASKS: ", tasks);

  const handlerError = (error: Error) => {
    console.log(error.message);
  };

  const load = useCallback(async () => {
    try {
      const tasks = await repo.loadTasks();
      setTasks(tasks);
    } catch (error) {
      handlerError(error as Error);
    }
  }, [repo]);

  const addTask = async (task: ProtoTaskStructure) => {
    try {
      const finalTask = await repo.createTask(task);
      setTasks([...tasks, finalTask]);
    } catch (error) {
      handlerError(error as Error);
    }
  };

  const deleteTask = async (id: TaskStructure["id"]) => {
    try {
      await repo.delete(id);
      setTasks(tasks.filter((item) => item.id !== id));
    } catch (error) {
      handlerError(error as Error);
    }
  };

  const updateTask = async (task: TaskStructure) => {
    try {
      const finalTask = await repo.update(task);
      setTasks(tasks.map((item) => (item.id === task.id ? finalTask : item)));
    } catch (error) {
      handlerError(error as Error);
    }
  };

  return {
    tasks,
    load,
    addTask,
    deleteTask,
    updateTask,
  };
}
