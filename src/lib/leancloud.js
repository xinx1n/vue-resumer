import AV from 'leancloud-storage'

const APP_ID = '1rEWemJcxcSINMyLsG4eVFNM-gzGzoHsz'
const APP_KEY = 'zGeXH9alNdDpTFk8cPnMoSMo'

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
})

export default AV
