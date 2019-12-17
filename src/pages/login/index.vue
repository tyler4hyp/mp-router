<template>
    <div>
        <button @click="login">登录</button>
    </div>
</template>

<script>
export default {
    created() {
        this.$router.addRoute('pages/login/main', this)
    },
    methods: {
        login() {
            wx.setStorageSync('token', '123')
            let target = decodeURIComponent(this.$route.query.ru)
            let arr = target.split('?')
            this.$router.replace({
                path: arr[0],
                query: this.parseQuery(arr[1])
            })
        },

        parseQuery(str) {
            if (str) {
                let arr = str.split('&')
                let query = {}
                arr.forEach(item => {
                    let temp = item.split('=')
                    query[temp[0]] = temp[1]
                })
                return query
            } else {
                return ''
            }
        }
    }
}
</script>

<style scoped>
</style>