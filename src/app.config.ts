export default defineAppConfig({
  pages: [
    'pages/memos/index',
    'pages/tasks/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '备忘记事',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#6b7280',
    selectedColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/memos/index',
        text: '备忘'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
