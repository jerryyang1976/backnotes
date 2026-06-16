import { createClient } from '@supabase/supabase-js'

// Supabase 配置
// 部署时需要在构建时设置环境变量，或直接替换这里的值
// 注意：这里使用默认值，实际部署时需要替换为真实的 Supabase 配置
const SUPABASE_URL = 'https://bcjhqmwwwclsbwdintha.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamhxbXd3d2Nsc2J3ZGludGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTE5OTksImV4cCI6MjA5NzE4Nzk5OX0.1v7musK8wp-7Dzw-5kk6iskCatYWOjB7d5Y276yzfes'

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 数据类型定义
export interface Memo {
  id: number
  content: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  deadline: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

// 备忘录 API
export const memoApi = {
  // 获取所有备忘
  async getAll(): Promise<Memo[]> {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取备忘失败:', error)
      throw error
    }
    return data || []
  },

  // 搜索备忘
  async search(keyword: string): Promise<Memo[]> {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .ilike('content', `%${keyword}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('搜索备忘失败:', error)
      throw error
    }
    return data || []
  },

  // 创建备忘
  async create(content: string): Promise<Memo> {
    const { data, error } = await supabase
      .from('memos')
      .insert({ content })
      .select()
      .single()
    
    if (error) {
      console.error('创建备忘失败:', error)
      throw error
    }
    return data
  },

  // 更新备忘
  async update(id: number, content: string): Promise<Memo> {
    const { data, error } = await supabase
      .from('memos')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新备忘失败:', error)
      throw error
    }
    return data
  },

  // 删除备忘
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除备忘失败:', error)
      throw error
    }
  }
}

// 任务 API
export const taskApi = {
  // 获取所有任务
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取任务失败:', error)
      throw error
    }
    return data || []
  },

  // 创建任务
  async create(task: { title: string; description?: string; deadline?: string }): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description || null,
        deadline: task.deadline || null,
        is_completed: false
      })
      .select()
      .single()
    
    if (error) {
      console.error('创建任务失败:', error)
      throw error
    }
    return data
  },

  // 更新任务
  async update(id: number, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新任务失败:', error)
      throw error
    }
    return data
  },

  // 删除任务
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除任务失败:', error)
      throw error
    }
  }
}