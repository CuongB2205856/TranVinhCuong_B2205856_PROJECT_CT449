// frontend/src/main.js (Ví dụ cấu hình Vuetify chính xác)

import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'

// ⚠️ BẮT BUỘC: Import CSS cơ bản của Vuetify và Icons
import 'vuetify/styles' 
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' 

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

// Khởi tạo ứng dụng
createApp(App)
  .use(router)
  .use(vuetify) // <--- ĐĂNG KÝ VUETIFY VỚI ỨNG DỤNG
  .mount('#app')