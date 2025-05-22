import { defineStore } from 'pinia'
import { ref } from 'vue'

const useRadioInfo = defineStore('goodsStatus', () => {
    let dictsSource = ref<object>({
            goods_status: [ //商品状态
                {
                    label: '上架',
                    value: 10,
                },
                {
                    label: '下架',
                    value: 20,
                }
            ],
            deduct_stock_type: [ // 库存计算方式
                {
                    label: '下单减库存',
                    value: 10,
                },
                {
                    label: '付款减库存',
                    value: 20,
                }
            ],
            is_points_gift: [ //积分赠送
                {
                    label: '开启',
                    value: 1,
                },
                {
                    label: '关闭',
                    value: 0,
                }
            ],
            is_points_discount: [ //积分折扣
                {
                    label: '开启',
                    value: 1,
                },
                {
                    label: '关闭',
                    value: 0,
                }
            ],
            is_enable_grade: [ //会员折扣
                {
                    label: '开启',
                    value: 1,
                },
                {
                    label: '关闭',
                    value: 0,
                }
            ],
            is_alone_grade: [ //会员折扣设置
                {
                    label: '默认等级折扣',
                    value: 0,
                },
                {
                    label: '单独设置折扣',
                    value: 1,
                },

            ],
            spec_type: [ //规格类型
                {
                    label: '单规格',
                    value: 10,
                },
                {
                    label: '多规格',
                    value: 20,
                },
            ],
            // 地址管理
            addressType: [
                {
                    label: '发货地址',
                    value: 10,
                },
                {
                    label: '退货地址',
                    value: 20,
                },
            ],
            // 分类状态
            category_status: [
                {
                    label: '显示',
                    value: 1
                },
                {
                    label: '隐藏',
                    value: 0
                }
            ],
            // 是否默认
            is_default: [
                {
                    label: '是',
                    value: 1
                },
                {
                    label: '否',
                    value: 0
                }
            ]
    })
    return {
        dictsSource,
    }
})

export default useRadioInfo