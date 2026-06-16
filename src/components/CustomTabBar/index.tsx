import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FileText, Clipboard, User } from 'lucide-react-taro'
import { useState, useEffect } from 'react'

interface TabItem {
  pagePath: string
  text: string
  icon: string
}

const tabs: TabItem[] = [
  { pagePath: '/pages/memos/index', text: '备忘', icon: 'file-text' },
  { pagePath: '/pages/tasks/index', text: '任务', icon: 'clipboard' },
  { pagePath: '/pages/profile/index', text: '我的', icon: 'user' }
]

export default function CustomTabBar() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // 获取当前页面路径
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
    const color = isActive ? '#0ea5e9' : '#6b7280'
    const size = 24

    switch (icon) {
      case 'file-text':
        return <FileText size={size} color={color} />
      case 'clipboard':
        return <Clipboard size={size} color={color} />
      case 'user':
        return <User size={size} color={color} />
      default:
        return null
    }
  }

  return (
    <View
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '50px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        zIndex: 1000
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = current === index
        return (
          <View
            key={tab.pagePath}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              cursor: 'pointer'
            }}
            onClick={() => switchTab(index)}
          >
            {renderIcon(tab.icon, isActive)}
            <Text
              style={{
                fontSize: '12px',
                marginTop: '4px',
                color: isActive ? '#0ea5e9' : '#6b7280'
              }}
            >
              {tab.text}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
