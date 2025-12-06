<template>
    <v-app>
        <Header v-if="!isAdminRoute" /> 

        <v-main>
            <router-view />
        </v-main>
        
        <Footer v-if="!isAdminRoute" /> 

        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
            location="top"
            class="mt-16" 
            elevation="4"
        >
            <div class="d-flex align-center">
                <v-icon v-if="snackbar.icon" start class="mr-2">{{ snackbar.icon }}</v-icon>
                <span class="font-weight-medium">{{ snackbar.message }}</span>
            </div>

            <template v-slot:actions>
                <v-btn
                    color="white"
                    variant="text"
                    size="small"
                    @click="snackbar.show = false"
                    icon="mdi-close"
                >
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
    name: 'App',
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            // Cấu hình cho Snackbar
            snackbar: {
                show: false,
                message: '',
                color: 'black',
                icon: 'mdi-check-circle'
            }
        };
    },
    computed: {
        isAdminRoute() {
            return this.$route.path.startsWith('/admin');
        }
    },
    methods: {
        // Hàm xử lý sự kiện hiển thị thông báo
        handleNotification(event) {
            const { message, color, icon } = event.detail;
            this.snackbar.message = message || 'Thông báo hệ thống';
            this.snackbar.color = color || 'black';
            this.snackbar.icon = icon || 'mdi-information';
            this.snackbar.show = true;
        }
    },
    mounted() {
        // Lắng nghe sự kiện 'show-notification' từ các component con
        window.addEventListener('show-notification', this.handleNotification);
    },
    unmounted() {
        // Hủy lắng nghe khi App bị hủy (hiếm khi xảy ra)
        window.removeEventListener('show-notification', this.handleNotification);
    }
};
</script>

<style scoped>
/* Class mt-16 (margin-top: 64px) để thông báo nằm ngay dưới Header chuẩn của Vuetify */
.mt-16 {
    margin-top: 64px !important;
}
</style>