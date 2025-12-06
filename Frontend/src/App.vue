<template>
    <v-app>
        <Header v-if="!isAdminRoute" /> 

        <v-main>
            <router-view />
        </v-main>
        
        <Footer v-if="!isAdminRoute" /> 
    </v-app>
</template>

<script>
// Import hai Components mới
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
    name: 'App',
    components: {
        Header,
        Footer,
    },
    computed: {
        isAdminRoute() {
            // Trả về true nếu đường dẫn bắt đầu bằng /admin
            return this.$route.path.startsWith('/admin');
        }
    }
};
</script>