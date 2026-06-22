import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { FileText, ClipboardList, User } from 'lucide-react-taro'

interface TabItem {
  pagePath: string
  text: string
  icon: string
}

const tabs: TabItem[] = [
  { pagePath: '/pages/memos/index', text: '笔记', icon: 'file-text' },
  { pagePath: '/pages/tasks/index', text: '待办', icon: 'clipboard-list' },
  { pagePath: '/pages/profile/index', text: '我的', icon: 'user' }
]

export default function CustomTabBar() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const path = Taro.getCurrentInstance().router?.path || ''
    const index = tabs.findIndex(tab => tab.pagePath === path)
    if (index !== -1) {
      setCurrent(index)
    }
  }, [])

  const switchTab = (index: number) => {
    setCurrent(index)
    Taro.switchTab({ url: tabs[index].pagePath })
  }

  const renderIcon = (icon: string, isActive: boolean) => {
    const color = isActive ? '#8b7355' : '#7a6a5a'
    const size = 24

    switch (icon) {
      case 'file-text':
        return <FileText size={size} color={color} />
      case 'clipboard-list':
        return <ClipboardList size={size} color={color} />
      case 'user':
        return <User size={size} color={color} />
      default:
        return null
    }
  }

  return (
    <View 
      className="flex flex-row justify-around items-center fixed bottom-0 left-0 right-0 h-14 z-50"
      style={{ backgroundColor: '#f5ebe0', borderTop: '1px solid #d9cbb8' }}
    >
      {tabs.map((tab, index) => {
        const isActive = current === index
        return (
          <View
            key={tab.pagePath}
            className="flex flex-col items-center justify-center flex-1 p-2"
            onClick={() => switchTab(index)}
          >
            {renderIcon(tab.icon, isActive)}
            <Text 
              className="block text-xs mt-1"
              style={{ color: isActive ? '#8b7355' : '#7a6a5a' }}
            >
              {tab.text}
            </Text>
          </View>
        )
      })}
    </View>
  )
}