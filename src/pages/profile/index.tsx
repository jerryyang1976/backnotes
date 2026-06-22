import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { memoApi, taskApi } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toast'
import { FileText, Check, Clock, TrendingUp } from 'lucide-react-taro'
import CustomTabBar from '@/components/CustomTabBar'

interface Stats {
  totalMemos: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
}

const ProfilePage = () => {
  const [stats, setStats] = useState<Stats>({
    totalMemos: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      console.log('[Profile] Loading stats...')
      
      // 加载备忘统计
      const memos = await memoApi.getAll()
      console.log('[Profile] Memos loaded:', memos.length)
      
      // 加载任务统计
      const tasks = await taskApi.getAll()
      console.log('[Profile] Tasks loaded:', tasks.length)
      
      setStats({
        totalMemos: memos.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.is_completed).length,
        pendingTasks: tasks.filter(t => !t.is_completed).length
      })
    } catch (error) {
      console.error('[Profile] Load error:', error)
      toast.error('加载统计数据失败')
    }
  }

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0

  return (
    <View className="min-h-screen px-4 py-6" style={{ backgroundColor: '#faf6f2' }}>
      {/* 统计卡片 */}
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: '#fdfaf7' }}>
        <CardContent className="p-6">
          <View className="flex items-center justify-center gap-4">
            <View className="text-center">
              <Text className="block text-3xl font-bold text-amber-700">
                {stats.totalMemos}
              </Text>
              <Text className="block text-sm text-gray-500 mt-1">
                笔记记录
              </Text>
            </View>
            <View className="w-px h-12 bg-gray-200" />
            <View className="text-center">
              <Text className="block text-3xl font-bold text-amber-700">
                {stats.totalTasks}
              </Text>
              <Text className="block text-sm text-gray-500 mt-1">
                待办任务
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 详细统计 */}
      <View className="flex flex-col gap-3">
        <Card className="shadow-sm" style={{ backgroundColor: '#fdfaf7' }}>
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText size={20} color="#b45309" />
                </View>
                <Text className="block text-base font-medium text-gray-700">
                  笔记总数
                </Text>
              </View>
              <Badge variant="secondary">
                <Text className="block text-sm">{stats.totalMemos}</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>

        <Card className="shadow-sm" style={{ backgroundColor: '#fdfaf7' }}>
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock size={20} color="#b45309" />
                </View>
                <Text className="block text-base font-medium text-gray-700">
                  待办任务
                </Text>
              </View>
              <Badge variant="secondary">
                <Text className="block text-sm">{stats.pendingTasks}</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>

        <Card className="shadow-sm" style={{ backgroundColor: '#fdfaf7' }}>
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Check size={20} color="#b45309" />
                </View>
                <Text className="block text-base font-medium text-gray-700">
                  已完成
                </Text>
              </View>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <Text className="block text-sm">{stats.completedTasks}</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp size={20} color="#f59e0b" />
                </View>
                <Text className="block text-base font-medium text-gray-700">
                  完成率
                </Text>
              </View>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <Text className="block text-sm">{completionRate}%</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 关于 */}
      <View className="mt-6 text-center">
        <Text className="block text-xs text-gray-400">
          备忘录 & 计划任务 v1.0
        </Text>
        <Text className="block text-xs text-gray-400 mt-1">
          数据存储：Supabase 云端数据库
        </Text>
      </View>
      <CustomTabBar />
    </View>
  )
}

export default ProfilePage