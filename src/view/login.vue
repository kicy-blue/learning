<template>
    <div>
        {{message}}
    </div>
</template>

<script>
    import MD5 from "../services/MD5";
    export default {
        name: "login",
        layout: 'default',
        data(){
            return{
                message:'模拟登入中。。。。'
            }
        },
        created() {
            // Save the token.

            // this.$store.dispatch('auth/saveToken', {
            //     token: '8C3D43EC240C4A2AC281531D26EA71265675C04C4EB1C18E0197FE0089C8AAF04589D642738F126DE5C7FA06363F17E9',
            //     remember: 365
            // })
            // setTimeout(()=>{
            //     this.$router.push({name:'search'})
            // },2000)


            let loginPaswd = (new MD5()).hexMd5('zaq123456');
            this.$http.post('customer/Goldmine/PaswdLogin',{loginName:"17603005695",loginPaswd:loginPaswd})
            .then((response)=>{
                this.$store.dispatch('auth/saveToken', {
                    token: response.data.Body.ticket,
                    remember: 365
                })

                this.message='登入成功'

                setTimeout(()=>{
                    this.$router.push({name:'search'})
                },2000)

            })





        }
    }
</script>

<style scoped>

</style>