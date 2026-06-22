export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '待办' })
  : { navigationBarTitleText: '待办' }