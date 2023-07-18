import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isAuthenticated: false
    }
  },
  {
    path: '/secured',
    name: 'Secured',
    meta: {
      isAuthenticated: true
    },
    component: () => import('../views/Secured.vue')
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    meta: {
      isAuthenticated: false
    },
    component: () => import('../views/Unauthorized.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.isAuthenticated) {
    const basePath = window.location.toString();
    if (!Vue.$keycloak.authenticated) {
      Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path })
    } else if (Vue.$keycloak.hasResourceRole('vue-demo-user')) {
      Vue.$keycloak.updateToken(70)
        .then(() => {
          next();
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      next({ name: 'Unauthorized' });
    }
  } else {
    next();
  }
});

const app = createApp(/* ... */);
app.use(router);
app.mount('#app');
