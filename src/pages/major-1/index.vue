<template>
    <div>
        <button @click="sub1">通往sub-1</button>
        <card></card>
        <button @click="major1">通往major-1</button>
    </div>
</template>

<script>
import card from '@/components/card.vue'

export default {
    components: {
        card
    },
    created() {
        this.$router.addRoute('pages/major-1/main', this)
    },
    methods: {
        sub1() {
            this.$router.push({
                path: 'pages/subpack-1/sub-1/main'
            })
        },

        beforeRouteEnter(to, from, next) {
            console.log('major-1')
            console.log(to, from)
            next()
        },

        major1() {
            this.$router.push({
                path: 'pages/major-1/main',
                query: {
                    cityId: this.$route.query.cityId + 1
                }
            })
        }
    },
    onShareAppMessage: function (res) {
        return {
            title: 'major-1',
            path: '/pages/major-1/main?cityId=1',
            imageUrl: ''
        }
    }
}
</script>

<style scoped>
</style>