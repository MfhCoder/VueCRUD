const routes=[
    {path:'/Item',component:Item},
    {path:'/login',component:login},

]

const router=new VueRouter({
    routes
})

var token = localStorage.getItem("Token");
if(token == ""){
    router.push("login");      
}

const app = new Vue({
    router
}).$mount('#app')
