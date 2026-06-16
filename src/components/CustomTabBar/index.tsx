import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

const tabs = [
  { pagePath: '/pages/memos/index', text: '备忘' },
  { pagePath: '/pages/tasks/index', text: '任务' },
  { pagePath: '/pages/profile/index', text: '我的' }
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
    <View className="flex flex-row justify-around items-center fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-50">
      {tabs.map((tab, index) => {
        const isActive = current === index
        return (
          <View 
            key={tab.pagePath}
            className="flex flex-col items-center justify-center flex-1 p-2"
            onClick={() => switchTab(index)}
          >
            <View 
              className={`px-3 py-1 rounded-lg ${isActive ? 'bg-sky-500' : 'bg-gray-100'}`}
            >
              <Text className={`block text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {tab.text}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
