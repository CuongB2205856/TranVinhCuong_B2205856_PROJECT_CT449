<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card class="pa-8 elevation-8">
        <v-card-title class="text-h5 text-center mb-4">Đăng Ký Tài Khoản</v-card-title>
        
        <v-form>
          <v-text-field label="Tên đầy đủ" prepend-inner-icon="mdi-card-account-details-outline" variant="outlined" required></v-text-field>
          <v-text-field label="Email" prepend-inner-icon="mdi-email" variant="outlined" required></v-text-field>
          <v-text-field label="Mật khẩu" type="password" prepend-inner-icon="mdi-lock" variant="outlined" required></v-text-field>
          <v-text-field label="Xác nhận mật khẩu" type="password" prepend-inner-icon="mdi-lock-check" variant="outlined" required></v-text-field>

          <v-checkbox 
            label="Tôi đồng ý với các điều khoản"
            density="compact"
            required
          ></v-checkbox>

          <v-btn color="success" size="large" block class="mt-4">
            Đăng Ký
          </v-btn>
        </v-form>

        <div class="text-center mt-4">
          <v-btn 
            variant="text" 
            color="primary" 
            @click="$emit('go-login')"
          >
            Đã có tài khoản? Đăng nhập
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>