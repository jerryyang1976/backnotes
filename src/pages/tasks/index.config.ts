export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '任务' })
  : { navigationBarTitleText: '任务' }