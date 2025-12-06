<template>
    <div class="h-auto min-h-[90vh] flex justify-center items-center bg-white my-10">
        <v-card 
            class="mx-auto pa-6 rounded-xl shadow-md border border-gray-200 bg-white" 
            elevation="4"
            max-width="500"
            width="100%"
        >
            <div class="text-center mb-6 mt-2">
                <v-icon size="40" class="text-black mb-2">mdi-account-plus</v-icon>
                <h2 class="text-xl font-bold text-black">Đăng ký thành viên</h2>
                <v-alert v-if="serverError" type="error" dense variant="tonal" class="mt-4 text-left text-sm" closable>
                    {{ serverError }}
                </v-alert>
            </div>

            <Form @submit="submitRegister" :validation-schema="schema" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <Field name="hoLot" v-slot="{ field, errors }">
                        <v-text-field v-bind="field" label="Họ lót" variant="outlined" color="black" :error-messages="errors" density="comfortable" />
                    </Field>
                    <Field name="ten" v-slot="{ field, errors }">
                        <v-text-field v-bind="field" label="Tên" variant="outlined" color="black" :error-messages="errors" density="comfortable" />
                    </Field>
                </div>

                <Field name="phone" v-slot="{ field, errors }">
                    <v-text-field 
                        v-bind="field" 
                        label="Số điện thoại" 
                        prepend-inner-icon="mdi-phone-outline"
                        variant="outlined" 
                        color="black" 
                        :error-messages="errors" 
                        density="comfortable"
                    />
                </Field>

                <Field name="gender" v-slot="{ field, errors }">
                    <v-select
                        v-bind="field"
                        label="Giới tính"
                        :items="['Nam', 'Nữ', 'Khác']"
                        prepend-inner-icon="mdi-gender-male-female"
                        variant="outlined"
                        color="black"
                        :error-messages="errors"
                        density="comfortable"
                    ></v-select>
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
                        color="black"
                        :error-messages="errors" 
                        density="comfortable"
                    />
                </Field>

                <Field name="confirmPassword" v-slot="{ field, errors }">
                    <v-text-field 
                        v-bind="field" 
                        :type="showPassword ? 'text' : 'password'" 
                        label="Nhập lại mật khẩu"
                        prepend-inner-icon="mdi-lock-check-outline"
                        variant="outlined" 
                        color="black"
                        :error-messages="errors" 
                        density="comfortable"
                    />
                </Field>

                <v-btn 
                    block
                    type="submit" 
                    color="black" 
                    class="text-white w-full mt-4 font-bold" 
                    variant="elevated" 
                    size="large"
                    :loading="isLoading"
                >
                    Đăng ký
                </v-btn>
            </Form>

            <p class="text-sm text-gray-600 my-6 text-center">
                Đã có tài khoản?
                <router-link to="/login" class="text-black font-weight-bold hover:underline">Đăng nhập</router-link>
            </p>
        </v-card>
    </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import AuthService from '@/services/Auth.service'

export default {
    name: "Register",
    components: {
        Form,
        Field,
    },
    data() {
        return {
            showPassword: false,
            serverError: "",
            isLoading: false,
            schema: yup.object({
                hoLot: yup.string().required("Vui lòng nhập họ lót"),
                ten: yup.string().required("Vui lòng nhập tên"),
                phone: yup.string()
                    .required("Số điện thoại là bắt buộc")
                    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, "SĐT không hợp lệ"),
                gender: yup.string().required("Vui lòng chọn giới tính"),
                password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Nhập mật khẩu"),
                confirmPassword: yup
                    .string()
                    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
                    .required("Nhập lại mật khẩu"),
            }),
        }
    },
    methods: {
        async submitRegister(values) {
            this.isLoading = true;
            this.serverError = "";
            try {
                const payload = {
                    HoLot: values.hoLot,
                    Ten: values.ten,
                    DienThoai: values.phone,
                    Phai: values.gender,
                    Password: values.password
                };

                await AuthService.registerReader(payload);
                
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                this.$router.push('/login');
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                this.serverError = error.response?.data?.message || "Đăng ký thất bại. Số điện thoại có thể đã tồn tại.";
            } finally {
                this.isLoading = false;
            }
        },
    },
}
</script>