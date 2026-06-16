export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '备忘' })
  : { navigationBarTitleText: '备忘' }