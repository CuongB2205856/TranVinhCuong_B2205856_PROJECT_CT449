<template>
    <v-app>
        <Header /> 

        <v-main>
            <router-view />
        </v-main>
        
        <Footer /> 
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
    }
};
</script>