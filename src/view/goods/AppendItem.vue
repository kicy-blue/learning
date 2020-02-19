<template>
    <div></div>
</template>

<script>
    export default {
        name: "AppendItem",

        mounted() {
            appendItem(itemList = [])
            {
                this.$http.post('Order/ShoppingTrolley/AppendItem', {
                    clientType: 0,
                    autoModel: null,
                    itemList: itemList,
                }).then((response) => {
                    this.reviews.data = response.data.Body.itemReviewDetailInfoList;
                    this.reviews.count = response.data.Body.reviewCount;
                    this.reviews.userTotal = response.data.Body.reviewUserTotal;

                })
            }
        }
    }
</script>

<style scoped>

</style>