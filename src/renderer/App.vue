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
			// _this.$electron.ipcRenderer.send('checkForUpdate')
			// _this.$electron.ipcRenderer.on('message', (event, text) => {
			// 	console.log(arguments)
			// 	_this.tips = text
			// 	console.log(text)

			// 	if (text == '检测到新版本，正在下载...') {
					
			// 			_this.updateProgram()
					
			// 	} else {
					
			// 		setTimeout(function() {
			// 			_this.loading = false;
			// 		}, 500);
			// 	}
			// })
		},
		beforeDestroy() {
			this.$electron.ipcRenderer.removeAll(["message", "downloadProgress", "isUpdateNow"]);
		},
		methods: {
			updateProgram() {
				var _this = this
				// _this.$electron.ipcRenderer.on('downloadProgress', (event, progressObj) => {

				//   _this.downloadPercent = progressObj.percent || 0
				// })
				ipcRenderer.on('downloadProgress', (event, progressObj) => {
					this.downloadPercent = Math.trunc(progressObj.percent) || 0
					// this.downloadPercent = progressObj.percent.toFixed(2) || 0
					console.log(Math.trunc(this.downloadPercent))
					console.log(Math.trunc(this.downloadPercent) === 100)
					if (Math.trunc(this.downloadPercent) === 100) {
						alert('开始更新...')
						setTimeout(function() {
							_this.loading = false;
						}, 500)
						ipcRenderer.on('isUpdateNow', function() {
							ipcRenderer.send('isUpdateNow')
						})
					}
				})
				
			},
			checkForUpdate() {
				const _this = this
				this.$message('检查更新')
				_this.$electron.ipcRenderer.send('checkForUpdate')
				_this.$electron.ipcRenderer.on('isUpdateNow', () => {
				  _this.$electron.ipcRenderer.send('isUpdateNow')
				})
			},
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
