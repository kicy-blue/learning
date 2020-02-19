<template>
    <div id="app">
        <transition name="page" mode="out-in">
            123
            <component :is="layout" v-if="layout"/>
        </transition>
    </div>
</template>
<script>

    // Load layout components dynamically.
    const requireContext = require.context('./layouts', false, /.*\.vue$/)

    const layouts = requireContext.keys()
        .map(file =>
            [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
        )
        .reduce((components, [name, component]) => {
            components[name] = component.default || component
            return components
        }, {})

    export default {
        el:'#app',
        components: {},

        data: () => ({
            layout: null,
            defaultLayout: 'default'
        }),

        metaInfo() {
            const {appName} = {appName: '养车无忧'}

            return {
                title: appName,
                // titleTemplate: `%s · ${this.$route.meta.title || ''}`
            }
        },

        mounted() {
          this.setLayout(null)
        },

        methods: {

            setLayout(layout) {
                if (!layout || !layouts[layout]) {
                    layout = this.defaultLayout
                }
                this.layout = layouts[layout]
            }
        }
    }
</script>
<style>
    body {
        font-size: 16px;
        background-color: #f8f8f8;
        -webkit-font-smoothing: antialiased;
    }
</style>
