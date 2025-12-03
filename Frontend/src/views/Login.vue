<template>
  <v-container class="d-flex justify-center align-center h-100vh">
    <v-card
      class="pa-8 rounded-xl shadow-lg w-full"
      max-width="450"
      elevation="10"
    >
      <div class="text-center mb-6">
        <v-icon size="50" color="primary">mdi-account-lock-open</v-icon>
        <h2 class="text-3xl font-weight-bold text-primary mt-2">
          Đăng Nhập Hệ Thống
        </h2>
        <v-alert v-if="serverError" type="error" dense text class="mt-3">
          {{ serverError }}
        </v-alert>
      </div>

      <Form @submit="submitLogin" :validation-schema="schema" class="space-y-5">
        <Field name="dienthoai" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            label="Số điện thoại"
            prepend-inner-icon="mdi-account-circle-outline"
            variant="outlined"
            color="primary"
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
            color="primary"
            :error-messages="errors"
          />
        </Field>

        <v-btn
          type="submit"
          color="primary"
          class="w-full py-6 font-weight-bold text-lg"
          block
          depressed
        >
          Đăng nhập
        </v-btn>
      </Form>

      <p class="text-sm text-center mt-4">
        Bạn chưa có tài khoản?
        <router-link to="/register" class="text-primary font-weight-medium"
          >Đăng ký ngay</router-link
        >
      </p>
    </v-card>
  </v-container>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/Auth.service"; // SỬA IMPORT

export default {
  name: "LoginPage",
  components: { Form, Field },
  data() {
    return {
      showPassword: false,
      serverError: "",
      schema: yup.object({
        dienthoai: yup.string().required("SĐT không được để trống"),
        password: yup.string().required("Mật khẩu không được để trống"),
      }),
    };
  },
  methods: {
    async submitLogin(values) {
      this.serverError = "";
      try {
        // SỬA: Gọi AuthService.loginReader
        // values.dienthoai map vào tham số phone
        const { token, data } = await AuthService.loginReader(values.dienthoai, values.password);
        
        const user = data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        this.$router.push("/books"); 
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        this.serverError = error.response?.data?.message || "Đăng nhập thất bại.";
      }
    },
  },
};
</script>

<style scoped>
/* Vuetify đã xử lý phần lớn layout, CSS này để căn chỉnh nhỏ */
.h-100vh {
  height: 100vh;
}
</style>
