import { request } from './request';

export function getDetail(iid) {
    return request({
        url: '/detail',
        params: {
            iid
        }
    })

}

export function getRecommend() {
    return request({
        url: '/recommend',
    })
}

/**
 * 把访问分散的数据全部封装到一个类里面，统一向组件传值展示
 */
export class Goods {
    constructor(itemInfo, columns, services) {
        this.title = itemInfo.title
        this.desc = itemInfo.desc
        this.newPrice = itemInfo.price
        this.oldPrice = itemInfo.oldPrice
        this.discount = itemInfo.discountDesc
        this.realPrice = itemInfo.lowNowPrice
        this.columns = columns
        this.services = services

    }
}

export class Shop {
    constructor(shopInfo) {
        this.logo = shopInfo.shopLogo
        this.name = shopInfo.name
        this.fans = shopInfo.cFans
        this.sells = shopInfo.cSells
        this.GoodsCount = shopInfo.cGoods
        this.score = shopInfo.score
    }
}

export class GoodsParam {
    constructor(info, rule) {
        //images可能没有值（有些商品有值，有些没有）
        this.images = info.images ? info.images[0] : '';
        this.infos = info.set
        this.sizes = rule.tables
    }
}