import { createApp } from 'vue';
import Keycloak from 'keycloak-js';
import App from '../App.vue';

const options = {
  url: 'http://localhost:8080/auth/',
  realm: 'myrealm',
  clientId: 'vue-demo'
};

const _keycloak = Keycloak(options);

const plugin = {
  install(app, options) {
    app.config.globalProperties.$keycloak = _keycloak;
    app.provide('$keycloak', _keycloak);
  }
};

const app = createApp(App);

app.use(plugin, { /* optional options */ });

app.mount('#app');


