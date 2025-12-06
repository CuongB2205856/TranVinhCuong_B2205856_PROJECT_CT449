<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-black">
        <v-icon class="mr-2">mdi-view-dashboard</v-icon>
        Thống Kê Hệ Thống
    </h2>

    <div v-if="isLoading" class="text-center py-12">
        <v-progress-circular indeterminate color="black" size="64"></v-progress-circular>
    </div>

    <div v-else>
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mx-auto" color="black" theme="dark" elevation="4">
                    <v-card-item>
                        <v-card-title class="text-h5 font-weight-bold">
                            <v-icon size="large" start>mdi-bookshelf</v-icon>
                            Tổng Đầu Sách
                        </v-card-title>
                        <div class="text-h2 font-weight-black mt-4 text-center">
                            {{ stats.books.totalTitles }}
                        </div>
                        <v-card-subtitle class="text-center mt-2 text-subtitle-1 text-grey-lighten-1">
                            Cuốn sách đang quản lý
                        </v-card-subtitle>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="mx-auto" color="grey-darken-3" theme="dark" elevation="4">
                    <v-card-item>
                        <v-card-title class="text-h5 font-weight-bold">
                            <v-icon size="large" start>mdi-cash-multiple</v-icon>
                            Thu Nhập Tháng {{ currentMonth }}
                        </v-card-title>
                        <div class="text-h2 font-weight-black mt-4 text-center">
                            {{ formatCurrency(stats.books.revenue) }}
                        </div>
                        <v-card-subtitle class="text-center mt-2 text-subtitle-1 text-grey-lighten-1">
                            Từ sách đã trả thành công
                        </v-card-subtitle>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <h3 class="text-2xl font-bold mt-10 mb-6 text-black">Tình Trạng Mượn Trả</h3>
        
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card elevation="2" class="rounded-lg border-l-8 border-black">
                    <v-card-text>
                        <div class="text-overline mb-1 text-black font-weight-bold">Đang Mượn</div>
                        <div class="text-h3 font-weight-bold text-black mb-2">
                            {{ stats.borrowing.dang_muon }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Sách đang ở phía độc giả</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="2" class="rounded-lg border-l-8 border-grey-darken-2">
                    <v-card-text>
                        <div class="text-overline mb-1 text-grey-darken-3 font-weight-bold">Chờ Duyệt</div>
                        <div class="text-h3 font-weight-bold text-grey-darken-3 mb-2">
                            {{ stats.borrowing.cho_xac_nhan }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Yêu cầu chưa xử lý</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="2" class="rounded-lg border-l-8 border-grey">
                    <v-card-text>
                        <div class="text-overline mb-1 text-grey-darken-2 font-weight-bold">Đã Trả</div>
                        <div class="text-h3 font-weight-bold text-grey-darken-2 mb-2">
                            {{ stats.borrowing.da_tra }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Lượt trả thành công</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card elevation="2" class="rounded-lg border-l-8 border-grey-lighten-1">
                    <v-card-text>
                        <div class="text-overline mb-1 text-grey-darken-1 font-weight-bold">Đã Từ Chối</div>
                        <div class="text-h3 font-weight-bold text-grey-darken-1 mb-2">
                            {{ stats.borrowing.da_tu_choi }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Yêu cầu không hợp lệ</div>
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
            currentMonth: new Date().getMonth() + 1,
            stats: {
                books: { totalTitles: 0, revenue: 0 }, 
                borrowing: { dang_muon: 0, da_tra: 0, cho_xac_nhan: 0, da_tu_choi: 0 }
            }
        };
    },
    methods: {
        async fetchStats() {
            this.isLoading = true;
            try {
                const res = await api.get('/api/staffs/stats');
                this.stats = res.data;
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
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
/* Style viền đơn sắc */
.border-black { border-left-color: #000000 !important; }
.border-grey-darken-2 { border-left-color: #616161 !important; }
.border-grey { border-left-color: #9E9E9E !important; }
.border-grey-lighten-1 { border-left-color: #BDBDBD !important; }
</style>