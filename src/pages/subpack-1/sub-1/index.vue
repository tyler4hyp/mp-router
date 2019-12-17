<template>
    <div>
        <button @click="index">通往index</button>
        <button @click="tab1">通往tab-1</button>
    </div>
</template>

<script>
export default {
    created() {
        if (this.$route.path === 'pages/subpack-1/sub-1/main') {
            this.beforeRouteEnter(this.$route, this.$previous, () => {}) 
        }
        this.$router.addRoute('pages/subpack-1/sub-1/main', this)
    },
    methods: {
        beforeRouteEnter(to, from, next) {
            console.log('sub-1')
            console.log(to, from)
            next()
        },

        index() {
            this.$router.push({
                path: 'pages/index/main',
                query: {
                    cityId: 1
                }
            })
        },

        tab1() {
            this.$router.push({
                path: 'pages/tab-1/main',
                query: {
                    cityId: 1
                }
            })
        }
    },

    onShareAppMessage: function (res) {
        return {
            title: 'sub-1',
            path: '/pages/subpack-1/sub-1/main?cityId=1',
            imageUrl: ''
        }
    }
}
</script>

<style scoped>
</style>