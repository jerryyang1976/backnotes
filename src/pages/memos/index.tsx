import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { memoApi, Memo } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import CustomTabBar from '@/components/CustomTabBar'

const MemosPage = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editMemo, setEditMemo] = useState<Memo | null>(null)
  const [memoContent, setMemoContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMemos()
  }, [])

  const loadMemos = async () => {
    setIsLoading(true)
    try {
      console.log('[Memos] Loading memos...')
      const data = await memoApi.getAll()
      console.log('[Memos] Loaded:', data)
      setMemos(data)
    } catch (error) {
      console.error('[Memos] Load error:', error)
      toast.error('加载备忘失败')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMemos = searchQuery 
    ? memos.filter(memo => memo.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : memos

  const handleAddMemo = () => {
    setEditMemo(null)
    setMemoContent('')
    setShowDialog(true)
  }

  const handleEditMemo = (memo: Memo) => {
    setEditMemo(memo)
    setMemoContent(memo.content)
    setShowDialog(true)
  }

  const handleSaveMemo = async () => {
    if (!memoContent.trim()) {
      toast.error('内容不能为空')
      return
    }

    setIsSaving(true)
    try {
      if (editMemo) {
        console.log('[Memos] Updating memo:', editMemo.id)
        await memoApi.update(editMemo.id, memoContent)
        toast.success('更新成功')
      } else {
        console.log('[Memos] Creating memo')
        await memoApi.create(memoContent)
        toast.success('创建成功')
      }
      setShowDialog(false)
      loadMemos()
    } catch (error) {
      console.error('[Memos] Save error:', error)
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMemo = async (memoId: number) => {
    try {
      const result = await Taro.showModal({
        title: '确认删除',
        content: '确定要删除这条备忘吗？'
      })
      
      if (result.confirm) {
        console.log('[Memos] Deleting memo:', memoId)
        await memoApi.delete(memoId)
        toast.success('删除成功')
        loadMemos()
      }
    } catch (error) {
      console.error('[Memos] Delete error:', error)
      toast.error('删除失败')
    }
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

  return (
    <View className="min-h-screen pb-20" style={{ backgroundColor: '#faf6f2' }}>
      {/* 导航栏下方覆盖区域 */}
      <View 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '44px', 
          backgroundColor: '#faf6f2', 
          zIndex: 1 
        }} 
      />
      {/* 顶部搜索栏 */}
      <View className="px-4 py-3" style={{ backgroundColor: '#f5ebe0' }}>
        <View className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#ffffff' }}>
          <Search size={18} color="#7a6a5a" />
          <Input
            className="w-full bg-transparent text-sm"
            placeholder="搜索备忘..."
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.detail.value)}
          />
        </View>
      </View>

      {/* 备忘列表 */}
      <View className="px-4 py-4" style={{ backgroundColor: '#faf6f2' }}>
        {isLoading ? (
          <View className="text-center py-8">
            <Text className="block text-gray-500">加载中...</Text>
          </View>
        ) : filteredMemos.length === 0 ? (
          <View className="text-center py-8">
            <Text className="block text-gray-500">
              {searchQuery ? '没有找到相关备忘' : '还没有备忘记录'}
            </Text>
          </View>
        ) : (
          filteredMemos.map((memo, index) => (
            <Card key={memo.id} className="mb-3 shadow-sm">
              <CardContent className="p-4">
                <View className="flex justify-between items-start gap-3">
                  <View className="flex-1">
                    <View className="flex items-start gap-2">
                      <Text className="block text-amber-700 font-bold text-sm shrink-0">{`#${index + 1}`}</Text>
                      <Text className="block text-gray-700 text-sm leading-relaxed flex-1">
                        {memo.content}
                      </Text>
                    </View>
                    <Text className="block text-xs text-gray-400 mt-2">
                      {formatDate(memo.created_at)}
                    </Text>
                  </View>
                  <View className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => handleEditMemo(memo)}
                    >
                      <Pencil size={16} color="#6b7280" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => handleDeleteMemo(memo.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </Button>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))
        )}
      </View>

      {/* 添加按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 50
        }}
      >
        <Button
          className="rounded-full shadow-lg"
          onClick={handleAddMemo}
        >
          <Plus size={24} color="#ffffff" />
        </Button>
      </View>

      {/* 添加/编辑弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMemo ? '编辑备忘' : '添加备忘'}</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            <View className="rounded-xl p-4 border border-gray-200">
              <Textarea
                style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                placeholderStyle="color: #9ca3af"
                placeholder="输入备忘内容..."
                value={memoContent}
                onInput={(e) => setMemoContent(e.detail.value)}
              />
            </View>
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              <Text className="block text-sm">取消</Text>
            </Button>
            <Button onClick={handleSaveMemo} disabled={isSaving}>
              <Text className="block text-sm text-white">{isSaving ? '保存中...' : '保存'}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CustomTabBar />
    </View>
  )
}

export default MemosPage