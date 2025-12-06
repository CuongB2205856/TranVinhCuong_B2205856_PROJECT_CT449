<template>
    <div class="h-auto min-h-[90vh] flex justify-center items-center bg-white my-10">
        <v-card 
            class="mx-auto pa-6 rounded-xl shadow-md border border-gray-200 bg-white" 
            elevation="4"
            max-width="400"
            width="100%"
        >
            <div class="text-center mb-6 mt-2">
                <v-icon size="40" class="text-black mb-2">mdi-login</v-icon>
                <h2 class="text-xl font-bold text-black">Đăng nhập</h2>
                <v-alert v-if="serverError" type="error" dense variant="tonal" class="mt-4 text-left text-sm" closable>
                    {{ serverError }}
                </v-alert>
            </div>

            <Form @submit="submitLogin" :validation-schema="schema" class="space-y-4">
                <Field name="phone" v-slot="{ field, errors }">
                    <v-text-field 
                        v-bind="field" 
                        label="Số điện thoại" 
                        prepend-inner-icon="mdi-phone-outline" 
                        variant="outlined"
                        density="comfortable"
                        color="black" 
                        :error-messages="errors" 
                    />
                </Field>

                <Field name="password" v-slot="{ field, errors }">
                    <v-text-field 
                        v-bind="field" 
                        :type="showPassword ? 'text' : 'password'" 
                        label="Mật khẩu"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword" 
                        variant="outlined"
                        density="comfortable" 
                        color="black"
                        :error-messages="errors" 
                    />
                </Field>

                <v-btn 
                    block
                    type="submit" 
                    color="black" 
                    class="text-white w-full mt-2 font-bold" 
                    variant="elevated" 
                    size="large"
                    :loading="isLoading"
                >
                    Đăng nhập
                </v-btn>
            </Form>

            <p class="text-sm text-gray-600 text-center mt-6">
                Bạn chưa có tài khoản?
                <router-link to="/register" class="text-black font-weight-bold hover:underline">Đăng ký ngay</router-link>
            </p>
        </v-card>
    </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import AuthService from '@/services/Auth.service'

export default {
    name: "Login",
    components: {
        Form,
        Field,
    },
    data() {
        return {
            showPassword: false,
            serverError: '',
            isLoading: false,
            schema: yup.object({
                phone: yup
                    .string()
                    .required('Số điện thoại không được để trống')
                    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
                password: yup
                    .string()
                    .required('Mật khẩu không được để trống')
                    .min(6, 'Mật khẩu ít nhất 6 ký tự'),
            }),
        }
    },
    methods: {
        async submitLogin(values) {
            this.isLoading = true;
            this.serverError = "";
            try {
                const response = await AuthService.loginReader(values.phone, values.password);
                
                const token = response.token;
                const user = response.data ? response.data.user : null;

                if (!user) {
                    throw new Error("Dữ liệu người dùng không hợp lệ.");
                }

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(user));

                // 1. Cập nhật Header
                window.dispatchEvent(new Event('storage'));

                // 2. [THAY ĐỔI] Gọi sự kiện hiển thị thông báo thay vì alert
                window.dispatchEvent(new CustomEvent('show-notification', {
                    detail: {
                        message: 'Đăng nhập thành công!',
                        color: 'success', // Màu xanh lá mặc định của success trong theme
                        icon: 'mdi-check-circle'
                    }
                }));

                // 3. Chuyển hướng
                this.$router.push('/');
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                this.serverError = error.response?.data?.message || error.message || 'Sai số điện thoại hoặc mật khẩu';
            } finally {
                this.isLoading = false;
            }
        },
    },
}
</script>