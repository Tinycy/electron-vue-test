<template>
	<div id="app" v-loading="loading">
		<router-view>

		</router-view>
	</div>
</template>

<script>
	import ElementUI from 'element-ui'
	import 'element-ui/lib/theme-chalk/index.css'
	import Vue from 'vue'
	Vue.use(ElementUI)
	export default {
		name: 'tiny',
		data() {
			return {
				loading: true
			}
		},
		created() {
			const _this = this
			setTimeout(function() {
				_this.loading = false;
			}, 500);
			
		},
		beforeDestroy() {
			
		},
		methods: {
			
			open() {
				this.$message('这是一条消息提示')
			},

			openVn() {
				const h = this.$createElement
				this.$message({
					message: h('p', null, [
						h('span', null, '内容可以是 '),
						h('i', {
							style: 'color: teal'
						}, 'VNode')
					])
				})
			}
		}
	}
</script>

<style>
	/* CSS */
</style>
