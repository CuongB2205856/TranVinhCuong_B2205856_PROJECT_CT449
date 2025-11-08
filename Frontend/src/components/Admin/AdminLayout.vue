<template>
    <v-app>
        <AdminHeader /> 

        <v-main class="bg-gray-100">
            <router-view />
        </v-main>
        
        <TheFooter /> 
    </v-app>
</template>

<script>
import AdminHeader from './AdminHeader.vue';
import Footer from '../Footer.vue'; 

export default {
    name: 'AdminLayout',
    components: { AdminHeader, Footer },
};
</script>