import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getTask, getTasks, updateTask, type Task } from '../api'

// Query keys in one place: ['tasks'] is the list, ['tasks', id] a single task.
export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
}

export const useTasks = () => useQuery({ queryKey: taskKeys.all, queryFn: getTasks })

export const useTask = (id: string) =>
  useQuery({ queryKey: taskKeys.detail(id), queryFn: () => getTask(id) })

/** Shared helper: every mutation refreshes everything under ['tasks']. */
function useInvalidateTasks() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: taskKeys.all })
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks()
  return useMutation({ mutationFn: createTask, onSuccess: invalidate })
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Task, 'id'>> }) =>
      updateTask(id, patch),
    onSuccess: invalidate,
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
