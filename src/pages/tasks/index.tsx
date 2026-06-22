import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { taskApi, Task } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, Check, Circle, Clock, Sparkles } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import CustomTabBar from '@/components/CustomTabBar'

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      console.log('[Tasks] Loading tasks...')
      const data = await taskApi.getAll()
      console.log('[Tasks] Loaded:', data)
      setTasks(data)
    } catch (error) {
      console.error('[Tasks] Load error:', error)
      toast.error('加载任务失败')
    } finally {
      setIsLoading(false)
    }
  }

  const pendingTasks = tasks.filter(task => !task.is_completed)
  const completedTasks = tasks.filter(task => task.is_completed)

  const handleAddTask = () => {
    setEditTask(null)
    setTaskTitle('')
    setTaskDescription('')
    setTaskDeadline('')
    setShowDialog(true)
  }

  const handleEditTask = (task: Task) => {
    setEditTask(task)
    setTaskTitle(task.title)
    setTaskDescription(task.description || '')
    setTaskDeadline(task.deadline || '')
    setShowDialog(true)
  }

  const handleSaveTask = async () => {
    if (!taskTitle.trim()) {
      toast.error('标题不能为空')
      return
    }

    setIsSaving(true)
    try {
      if (editTask) {
        console.log('[Tasks] Updating task:', editTask.id)
        await taskApi.update(editTask.id, {
          title: taskTitle,
          description: taskDescription || null,
          deadline: taskDeadline || null
        })
        toast.success('任务更新成功')
      } else {
        console.log('[Tasks] Creating task:', taskTitle)
        await taskApi.create({
          title: taskTitle,
          description: taskDescription,
          deadline: taskDeadline
        })
        toast.success('任务创建成功')
      }
      setShowDialog(false)
      loadTasks()
    } catch (error) {
      console.error('[Tasks] Save error:', error)
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleComplete = async (taskId: number, currentStatus: boolean) => {
    try {
      console.log('[Tasks] Toggle complete:', taskId, !currentStatus)
      await taskApi.update(taskId, { is_completed: !currentStatus })
      toast.success('任务状态已更新')
      loadTasks()
    } catch (error) {
      console.error('[Tasks] Toggle error:', error)
      toast.error('更新任务状态失败')
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const result = await Taro.showModal({
        title: '确认删除',
        content: '确定要删除这个任务吗？'
      })
      
      if (result.confirm) {
        console.log('[Tasks] Deleting task:', taskId)
        await taskApi.delete(taskId)
        toast.success('任务已删除')
        loadTasks()
      }
    } catch (error) {
      console.error('[Tasks] Delete error:', error)
      toast.error('删除任务失败')
    }
  }

  const handleGenerateTasks = async () => {
    // 纯前端方案暂不支持 AI 生成
    toast.info('AI生成功能需要后端支持，请手动添加任务')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    
    if (days < 0) {
      return `今天 ${timeStr}`
    } else if (days === 0) {
      return `今天 ${timeStr}`
    } else if (days === 1) {
      return `昨天 ${timeStr}`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  const formatDeadline = (deadline?: string | null) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) {
      return { text: '已过期', color: '#ef4444' }
    } else if (days === 0) {
      return { text: '今天截止', color: '#f59e0b' }
    } else if (days === 1) {
      return { text: '明天截止', color: '#f59e0b' }
    } else if (days <= 7) {
      return { text: `${days}天后截止`, color: '#6b7280' }
    } else {
      return { text: date.toLocaleDateString('zh-CN'), color: '#6b7280' }
    }
  }

  return (
    <View className="flex flex-col h-full" style={{ backgroundColor: '#faf6f2' }}>
      {/* Header */}
      <View className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#f5ebe0' }}>
        <Text className="block text-lg font-semibold" style={{ color: '#5a4a3a' }}>待办任务</Text>
        <View className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleGenerateTasks}
          >
            <Sparkles size={16} color="#b45309" />
            <Text className="block ml-1 text-sm">AI生成</Text>
          </Button>
          <Button size="sm" variant="secondary" onClick={handleAddTask}>
            <Plus size={16} color="#b45309" />
          </Button>
        </View>
      </View>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            <Text className="block text-sm">待办 ({pendingTasks.length})</Text>
          </TabsTrigger>
          <TabsTrigger value="completed">
            <Text className="block text-sm">已完成 ({completedTasks.length})</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="flex-1 overflow-auto px-4 py-3">
          {isLoading ? (
            <View className="flex items-center justify-center h-full">
              <Text className="block text-gray-500">加载中...</Text>
            </View>
          ) : pendingTasks.length === 0 ? (
            <View className="flex flex-col items-center justify-center h-full">
              <Text className="block text-gray-400 mb-2">暂无待办任务</Text>
              <Text className="block text-sm text-gray-400">点击上方按钮添加任务</Text>
            </View>
          ) : (
            <View className="flex flex-col gap-3">
              {pendingTasks.map((task, index) => {
                const deadlineInfo = formatDeadline(task.deadline)
                return (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <View className="flex items-start gap-3">
                        <Text className="block text-amber-700 font-bold text-sm shrink-0 mt-1">{`#${index + 1}`}</Text>
                        <View className="flex items-center justify-center w-6 h-6 shrink-0">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="w-6 h-6"
                            onClick={() => handleToggleComplete(task.id, task.is_completed)}
                          >
                            <Circle size={20} color="#6b7280" />
                          </Button>
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text className="block text-base font-medium text-gray-800">{task.title}</Text>
                          {task.description && (
                            <Text className="block text-sm text-gray-500 mt-1">{task.description}</Text>
                          )}
                          <View className="flex items-center gap-2 mt-2">
                            {deadlineInfo && (
                              <View className="flex items-center gap-1">
                                <Clock size={14} color={deadlineInfo.color} />
                                <Text className="block text-xs" style={{ color: deadlineInfo.color }}>{deadlineInfo.text}</Text>
                              </View>
                            )}
                            <Text className="block text-xs text-gray-400">{formatDate(task.created_at)}</Text>
                          </View>
                        </View>
                        <View className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleEditTask(task)}
                          >
                            <Pencil size={16} color="#6b7280" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </Button>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                )
              })}
            </View>
          )}
        </TabsContent>

        <TabsContent value="completed" className="flex-1 overflow-auto px-4 py-3">
          {isLoading ? (
            <View className="flex items-center justify-center h-full">
              <Text className="block text-gray-500">加载中...</Text>
            </View>
          ) : completedTasks.length === 0 ? (
            <View className="flex flex-col items-center justify-center h-full">
              <Text className="block text-gray-400">暂无已完成任务</Text>
            </View>
          ) : (
            <View className="flex flex-col gap-3">
              {completedTasks.map((task, index) => {
                const deadlineInfo = formatDeadline(task.deadline)
                return (
                  <Card key={task.id} className="opacity-60">
                    <CardContent className="p-4">
                      <View className="flex items-start gap-3">
                        <Text className="block text-gray-400 font-bold text-sm shrink-0 mt-1">{`#${index + 1}`}</Text>
                        <View className="flex items-center justify-center w-6 h-6 shrink-0">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="w-6 h-6"
                            onClick={() => handleToggleComplete(task.id, task.is_completed)}
                          >
                            <Check size={20} color="#22c55e" />
                          </Button>
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text className="block text-base font-medium text-gray-600">{task.title}</Text>
                          {task.description && (
                            <Text className="block text-sm text-gray-400 mt-1">{task.description}</Text>
                          )}
                          <View className="flex items-center gap-2 mt-2">
                            {deadlineInfo && (
                              <Badge variant="outline" className="text-xs">已完成</Badge>
                            )}
                            <Text className="block text-xs text-gray-400">{formatDate(task.created_at)}</Text>
                          </View>
                        </View>
                        <View className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </Button>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                )
              })}
            </View>
          )}
        </TabsContent>
      </Tabs>

      {/* 添加/编辑弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTask ? '编辑任务' : '添加任务'}</DialogTitle>
          </DialogHeader>
          <View className="py-4 flex flex-col gap-4">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">任务标题</Text>
              <View className="rounded-xl px-4 py-3 border border-gray-200">
                <Input
                  style={{ width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }}
                  placeholder="输入任务标题..."
                  value={taskTitle}
                  onInput={(e) => setTaskTitle(e.detail.value)}
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">任务描述（可选）</Text>
              <View className="rounded-xl p-4 border border-gray-200">
                <Textarea
                  style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                  placeholder="输入任务描述..."
                  value={taskDescription}
                  onInput={(e) => setTaskDescription(e.detail.value)}
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">截止时间（可选）</Text>
              <View className="rounded-xl px-4 py-3 border border-gray-200">
                <Input
                  style={{ width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }}
                  placeholder="输入截止日期（如：2024-12-20）"
                  value={taskDeadline}
                  onInput={(e) => setTaskDeadline(e.detail.value)}
                />
              </View>
            </View>
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              <Text className="block text-sm">取消</Text>
            </Button>
            <Button onClick={handleSaveTask} disabled={isSaving}>
              <Text className="block text-sm text-white">{isSaving ? '保存中...' : '保存'}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CustomTabBar />
    </View>
  )
}

export default TasksPage