import Vue from 'vue'
import appConfig from '../app.json'
import { requireLoginPages, loginPage } from './config.js'

const tabPages = appConfig.tabBar.list.map(item => {
    return item.pagePath
})

// 确认跳转之前暂存的路由
let pending = null

// 页面unload是否因返回触发
let unloadForBack = true

// 是否点击底部tab
let tabbarClick = false

const raw = {
    current: {
        path: '',
        query: {},
        replace: false,
        back: false,
        isTab: false
    },

    previous: {
        path: '',
        query: {},
        isTab: false
    },

    map: {},

    addRoute(path, instance) {
        this.map[path] = instance
    },

    push(location) {
        tabbarClick = location.tabbar
        transitionTo({
            path: location.path || '',
            query: location.query || {},
            replace: false,
            isTab: isTabPage(location.path)
        })
    },

    replace(location) {
        tabbarClick = location.tabbar
        transitionTo({
            path: location.path || '',
            query: location.query || {},
            replace: true,
            isTab: isTabPage(location.path)
        })
    },

    back() {
        wx.navigateBack({
            delta: 1
        })
    },

    beforeEach(to, from, next) {
        if (needLogin(to.path)) {
            goToLogin(pending, false)
        } else {
            next()
        }
    },

    reLaunch(location) {
        initRouter()
        wx.reLaunch({
            url: `/${location.path}${stringifyQuery(location.query)}`
        })
    }
}

export const router = new Proxy(raw, {
    get: function (target, key, receiver) {
        return target[key]
    },
    set: function (target, key, value, receiver) {
        if (key === 'current' || key === 'previous') {
            target[key] = value
            if (key === 'current') {
                pending = null
                routeChange()
            }
            return true
        } else {
            // 禁止修改其他属性
            return false
        }
    }
});

export function transitionTo(target) {
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

function runQueue(queue, fn, cb) {
    const step = index => {
        if (index >= queue.length) {
            cb()
        } else {
            if (queue[index]) {
                fn(queue[index], () => {
                    step(index + 1)
                })
            } else {
                step(index + 1)
            }
        }
    }
    step(0)
}

function iterator(hook, next) {
    hook(pending, router.current, (to) => {
        next()
    })
}

function stringifyQuery(query) {
    let str = '?'
    for(let x in query) {
        if (query.hasOwnProperty(x)) {
            str += `${x}=${query[x]}&`
        }
    }
    return str.substr(0, str.length - 1)
}

function routeChange() {
    if (router.current.path === '' || router.previous.path === '') {
        // 首次进入
        return
    }
    if (router.current.back) {
        // 返回
        return
    }
    if (tabbarClick) {
        // 点击底部tab
        tabbarClick = false
        return
    }
    if (router.current.isTab) {
        setUnloadForBack(false)
        wx.switchTab({
            url: `/${router.current.path}`
        })
    } else if (router.current.replace) {
        setUnloadForBack(false)
        wx.redirectTo({
            url: `/${router.current.path}${stringifyQuery(router.current.query)}`
        })
    } else {
        wx.navigateTo({
            url: `/${router.current.path}${stringifyQuery(router.current.query)}`
        })
    }
}

export function isTabPage(path) {
    return tabPages.indexOf(path) > -1
}

export function needLogin(path) {
    if (requireLoginPages.indexOf(path) > -1 && !wx.getStorageSync('token')) {
        return true
    } else {
        return false
    }
}

export function goToLogin(from, replace) {
    transitionTo(Object.assign({}, loginPage, {
        query: {
            ru: encodeURIComponent(from.path + stringifyQuery(from.query))
        },
        replace
    }))
}

export function initRouter() {
    router.previous = {
        path: '',
        query: '',
        isTab: ''
    }
    router.current = {
        path: '',
        query: {},
        replace: false,
        back: false,
        isTab: false
    }
}

export function setUnloadForBack(flag) {
    unloadForBack = flag
}

export function getUnloadForBack() {
    return unloadForBack
}