export default [
    {
        path:'/statistics',
        name:'statistics',
        component: () => import ('@/views/statistics/statistics.vue'),
        meta:{
            title:'数据统计',
            icon:'PieChart'
            // permission:['/manage/user/index']
        }
    }
]