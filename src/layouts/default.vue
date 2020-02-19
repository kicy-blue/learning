<template>
    <transition name="page" mode="out-in">
        <slot>
            <keep-alive include="search">
                <router-view />
            </keep-alive>
        </slot>
    </transition>
</template>

<script>
    export default {
        name: 'DefaultLayout',
    }
</script>

<style scoped>

</style>