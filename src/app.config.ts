export default defineAppConfig({
  pages: [
    'pages/memos/index',
    'pages/tasks/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f5ebe0',
    navigationBarTitleText: '轻记',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#8b8b8b',
    selectedColor: '#b8a082',
    backgroundColor: '#fefefe',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/memos/index',
        text: '笔记'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '待办'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})