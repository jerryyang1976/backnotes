import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface TabItem {
  pagePath: string
  text: string
  emoji: string
}

const tabs: TabItem[] = [
  { pagePath: '/pages/memos/index', text: '备忘', emoji: '📝' },
  { pagePath: '/pages/tasks/index', text: '任务', emoji: '✅' },
  { pagePath: '/pages/profile/index', text: '我的', emoji: '👤' }
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
            <Text style={{ fontSize: '24px' }}>{tab.emoji}</Text>
            <Text
              style={{
                fontSize: '12px',
                ma
