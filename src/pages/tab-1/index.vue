<template>
    <div>
        <button @click="sub1">通往sub-1</button>
        <button @click="Login">通往Login</button>
    </div>
</template>

<script>
export default {
    created() {
        this.$router.addRoute('pages/tab-1/main', this)
    },

    methods: {
        beforeRouteEnter(to, from, next) {
            console.log('tab-1')
            console.log(to, from)
            next()
        },

        sub1() {
            this.$router.replace({
                path: 'pages/subpack-1/sub-1/main',
                query: {
                    cityId: 1
                }
            })
        },

        Login() {
            this.$router.replace({
                path: 'pages/login/main',
                query: {
                    ru: encodeURIComponent('pages/tab-1/main')
                }
            })
        }
    }
}
</script>

<style scoped>
</style>