<template>
    <div>
        <button @click="major1">通往major-1</button>
        <button @click="reLaunch">reLaunch</button>
        <button @click="tab1">通往tab-1</button>
    </div>
</template>

<script>
export default {
    created() {
        this.$router.addRoute('pages/index/main', this)
    },
    methods: {
        major1() {
            this.$router.push({
                path: 'pages/major-1/main',
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
        },

        beforeRouteEnter(to, from, next) {
            console.log('index')
            console.log(to, from)
            next()
        },

        reLaunch() {
            this.$router.reLaunch({
                path: 'pages/major-1/main',
                query: {
                    cityId: 1
                }
            })
        }
    }
}
</script>

<style scoped>
</style>
 