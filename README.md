# 给mpvue加上路由守卫（mp-router)

## 需求
* mpvue中一个vue实例对应多个page实例，导致使用不同参数进入相同页面后，返回的时候前一个页面数据被覆盖
* 有时候需要返回前的页面数据来更新返回后的页面（例如列表和详情)
* 更早的获取异步数据（利用页面跳转时间)

## 原理
* runQueue方法来顺序执行路由守卫（来自vue-router源码）
* 在页面created方法中收集页面实例（mpvue在小程序初始化时会执行所有页面的created，不包括分包)
* onLoad中处理第一进入小程序的情况
* onShow中处理点击tabbar的情况

## 优势
* 实现了之前的需求
* 跳转tab页可以携带参数
* 避免使用onShow获取数据，因为onShow触发的时机比较晚，而且容易受到其他方面的影响（小程序分享，预览图片等）

``` bash
# 收集页面实例
## 收集主包页面
created() {
    this.$router.addRoute('pages/major-1/main', this)
},
## 收集分包页面
created() {
    if (this.$route.path === 'pages/subpack-1/sub-1/main') {
        this.beforeRouteEnter(this.$route, this.$previous, () => {}) 
    }
    this.$router.addRoute('pages/subpack-1/sub-1/main', this)
},

# 顺序执行守卫
function transitionTo(target) {
    let queue = [].concat(router.beforeEach);
    router.map[target.path] && queue.push(router.map[target.path].beforeRouteEnter);
    pending = target
    runQueue(queue, iterator, () => {
        router.previous = {
            path: router.current.path,
            query: router.current.query,
            isTab: router.current.isTab
        }
        router.current = target
    })
}
```
