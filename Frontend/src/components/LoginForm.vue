<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card class="pa-4 pa-sm-8 elevation-8">
        <v-card-title class="text-h5 text-center mb-4">Đăng Nhập</v-card-title>
        
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email / Tên đăng nhập"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            required
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Mật khẩu"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            required
            class="mb-4"
          ></v-text-field>

          <v-checkbox 
            v-model="rememberMe" 
            label="Ghi nhớ tôi"
            density="compact"
            hide-details
            class="mb-4"
          ></v-checkbox>

          <v-btn 
            type="submit" 
            color="primary" 
            size="large" 
            block 
            class="mb-4"
          >
            Đăng Nhập
          </v-btn>
        </v-form>

        <v-divider class="my-3"></v-divider>

        <div class="text-center">
          <v-btn 
            variant="text" 
            color="secondary" 
            @click="$emit('go-register')"
          >
            Chưa có tài khoản? Đăng ký
          </v-btn>
          <p class="mt-2"><a href="#">Quên mật khẩu?</a></p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const emit = defineEmits(['login-success', 'go-register']);

const handleLogin = () => {
  // Logic xử lý đăng nhập (gọi API, kiểm tra dữ liệu, v.v.)
  // Giả lập đăng nhập thành công
  console.log('Đăng nhập với:', email.value, password.value);
  emit('login-success'); 
};
</script>