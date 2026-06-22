export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '笔记' })
  : { navigationBarTitleText: '笔记' }