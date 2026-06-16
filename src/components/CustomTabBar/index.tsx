import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

const tabs = [
  { pagePath: '/pages/memos/index', text: '备忘', iconText: '备忘' },
  { pagePath: '/pages/tasks/index', text: '任务', iconText: '任务' },
  { pagePath: '/pages/profile/index', text: '我的', iconText: '我的' }
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
        height: '60px',
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
              padding: '8px'
            }}
            onClick={() => switchTab(index)}
          >
            <View
              style={{
                width: '40px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#0ea5e9' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: '12px',
                  color: isActive ? '#ffffff' : '#6b7280',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                {tab.iconText}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
