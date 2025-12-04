<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-blue-grey-darken-3">
        <v-icon class="mr-2">mdi-view-dashboard</v-icon>
        Thống Kê Hệ Thống
    </h2>

    <div v-if="isLoading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else>
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mx-auto" color="indigo" theme="dark" elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5 font-weight-bold">
                            <v-icon size="large" start>mdi-bookshelf</v-icon>
                            Tổng Đầu Sách
                        </v-card-title>
                        <div class="text-h2 font-weight-black mt-4 text-center">
                            {{ stats.books.totalTitles }}
                        </div>
                        <v-card-subtitle class="text-center mt-2 text-subtitle-1">
                            Cuốn sách đang quản lý
                        </v-card-subtitle>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="mx-auto" color="green-darken-2" theme="dark" elevation="10">
                    <v-card-item>
                        <v-card-title class="text-h5 font-weight-bold">
                            <v-icon size="large" start>mdi-cash-multiple</v-icon>
                            Tổng Giá Trị Kho
                        </v-card-title>
                        <div class="text-h2 font-weight-black mt-4 text-center">
                            {{ formatCurrency(stats.books.totalValue) }}
                        </div>
                        <v-card-subtitle class="text-center mt-2 text-subtitle-1">
                            Giá trị tài sản sách hiện có
                        </v-card-subtitle>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <h3 class="text-2xl font-bold mt-10 mb-6 text-gray-700">Tình Trạng Mượn Trả</h3>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card elevation="4" class="rounded-lg border-l-8 border-blue-500">
                    <v-card-text>
                        <div class="text-overline mb-1 text-blue-700 font-weight-bold">Đang Mượn</div>
                        <div class="text-h3 font-weight-bold text-blue-600 mb-2">
                            {{ stats.borrowing.dang_muon }}
                        </div>
                        <div class="text-caption text-grey">Sách đang ở phía độc giả</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="4" class="rounded-lg border-l-8 border-orange-500">
                    <v-card-text>
                        <div class="text-overline mb-1 text-orange-700 font-weight-bold">Chờ Duyệt</div>
                        <div class="text-h3 font-weight-bold text-orange-600 mb-2">
                            {{ stats.borrowing.cho_xac_nhan }}
                        </div>
                        <div class="text-caption text-grey">Yêu cầu chưa xử lý</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="4" class="rounded-lg border-l-8 border-green-500">
                    <v-card-text>
                        <div class="text-overline mb-1 text-green-700 font-weight-bold">Đã Trả</div>
                        <div class="text-h3 font-weight-bold text-green-600 mb-2">
                            {{ stats.borrowing.da_tra }}
                        </div>
                        <div class="text-caption text-grey">Lượt trả thành công</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="4" class="rounded-lg border-l-8 border-red-500">
                    <v-card-text>
                        <div class="text-overline mb-1 text-red-700 font-weight-bold">Đã Từ Chối</div>
                        <div class="text-h3 font-weight-bold text-red-600 mb-2">
                            {{ stats.borrowing.da_tu_choi }}
                        </div>
                        <div class="text-caption text-grey">Yêu cầu không hợp lệ</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
  </v-container>
</template>

<script>
import api from "@/services/api.service";

export default {
    name: "AdminStats",
    data() {
        return {
            isLoading: false,
            stats: {
                books: { totalTitles: 0, totalValue: 0 },
                borrowing: { dang_muon: 0, da_tra: 0, cho_xac_nhan: 0, da_tu_choi: 0 }
            }
        };
    },
    methods: {
        async fetchStats() {
            this.isLoading = true;
            try {
                // Gọi API vừa tạo ở Backend
                const res = await api.get('/api/staffs/stats');
                this.stats = res.data;
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
                alert("Không thể tải dữ liệu thống kê.");
            } finally {
                this.isLoading = false;
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    },
    created() {
        this.fetchStats();
    }
}
</script>

<style scoped>
.border-l-8 {
    border-left-width: 8px !important;
}
.border-blue-500 { border-left-color: #2196F3 !important; }
.border-orange-500 { border-left-color: #FF9800 !important; }
.border-green-500 { border-left-color: #4CAF50 !important; }
.border-red-500 { border-left-color: #F44336 !important; }
</style>