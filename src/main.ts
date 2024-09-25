import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import ElementPlus from "element-plus";
import { createGtm } from '@gtm-support/vue-gtm'
import { createPinia } from 'pinia'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import "element-plus/dist/index.css";
import ruRu from "element-plus/dist/locale/ru.mjs";
import "@fortawesome/fontawesome-free/css/all.css";
import App from './App.vue'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.use(createPinia())
app.use(ElementPlus, {
  locale: ruRu,
});

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
