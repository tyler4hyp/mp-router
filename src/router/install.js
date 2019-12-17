
import { router, transitionTo, isTabPage, initRouter, needLogin, goToLogin, getUnloadForBack, setUnloadForBack } from './router.js'

export default {
    install(Vue) {
        Vue.mixin({
            methods: {
                beforeRouteEnter(to, from, next) {
                    next()
                }
            },
        
            onUnload() {
                if (this.$isPage() && getUnloadForBack()) {
                    const history = getCurrentPages()
                    if (history.length < 2) {
                        // 重新打开小程序
                        initRouter()
                    } else {
                        transitionTo({
                            path: history[history.length - 2].route,
                            query: history[history.length - 2].options,
                            replace: false,
                            back: true,
                            isTab: isTabPage(history[history.length - 2].route)
                        })
                    }
                }
            },
        
            onLoad() {
                // 直接进入小程序任一页面
                if (this.$isPage()) {
                    setUnloadForBack(true)
                    const history = getCurrentPages()
                    if (history.length === 1 && this.$route.path === '') {
                        if (needLogin(history[0].route)) {
                            goToLogin({
                                path: history[0].route,
                                query: history[0].options
                            }, true)
                        } else {
                            this.$router.push({
                                path: history[0].route,
                                query: history[0].options
                            })
                        }
                    }
                }
            },

            onShow() {
                // 点击底部Tab跳转
                if (this.$isPage()) {
                    const history = getCurrentPages()
                    if (history.length === 1
                        && isTabPage(history[0].route)
                        && this.$route.path
                        && this.$route.isTab
                        && this.$route.path !== history[0].route) {
                        this.$router.push({
                            path: history[0].route,
                            query: history[0].options,
                            tabbar: true
                        })
                    }
                }
            }
        })
        
        Vue.prototype.$isPage = function isPage() {
            return this.$mp && this.$mp.mpType === 'page'
        }
        
        Object.defineProperty(Vue.prototype, '$router', {
            get() { return router }
        });
        
        Object.defineProperty(Vue.prototype, '$route', {
            get() { return router.current }
        });

        Object.defineProperty(Vue.prototype, '$previous', {
            get() { return router.previous }
        });
    }
}