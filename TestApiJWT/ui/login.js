const login={template:`
<div>
<div id="login">
<h3 class="text-center text-white pt-5">Login form</h3>
<div class="container">
    <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" class="col-md-6 border p-3">
            <div id="login-box" class="col-md-12">
                <form id="login-form" class="form" action="" method="post">
                    <h3 class="text-center text-primary">Login</h3>
                    <div class="form-group">
                        <label for="email" class="text-primary">Email:</label><br>
                        <input type="email" name="username" id="username" class="form-control" v-model="email">
                    </div>
                    <div class="form-group">
                        <label for="password" class="text-primary">Password:</label><br>
                        <input type="password" name="password" id="password" class="form-control" v-model="password">
                    </div>
                    <div class="form-group">
                        <br>
                        <button type="button" @click="createClick()" class="btn btn-primary btn-md">
                        login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div>

</div>

`,

data(){
    return{
        email:"",
        password:"",
    }
},
methods:{
    createClick(){
        axios.post(variables.API_URL+"Auth/token",{
            email:this.email,
            password:this.password
        })
        .then((response)=>{
            debugger;
            if(response.data.Token !== undefined){
                localStorage.setItem("Token",response.data.Token);
                var Role = response.data.Roles[0];
                localStorage.setItem("Role",Role);
                //alert(response.data.Token);
                router.push("Item");
            }else{
                localStorage.setItem("Token","");
                localStorage.setItem("Role","");
                alert(response.data);
            }

        }).catch((error) => {
            alert(error);
        });
    },

},
mounted:function(){
    localStorage.setItem("Token","");
    localStorage.setItem("Role","");
}

}
