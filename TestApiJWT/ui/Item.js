const Item={template:`
<div class="p-5">

<router-link class="btn btn-light btn-outline-primary"
to="/login">LogOut</router-link>


<button type="button"
class="btn btn-primary m-2 fload-end"
data-bs-toggle="modal"
data-bs-target="#exampleModal"
@click="addClick()">
 Add Item
</button>

<table class="table table-striped table-bordered table-hover">
<thead>
    <tr>
        <th>
             Id
        </th>
        <th>
            Title
        </th>
         <th>
         Description
        </th>
        <th>
            Options
        </th>
    </tr>
</thead>
<tbody>
    <tr v-for="item in Items">
        <td>{{item.ItemId}}</td>
        <td>{{item.Title}}</td>
        <td>{{item.Description}}</td>

        <td>
        
            <button type="button"
            v-if="Role=='Admin'"
            class="btn btn-success btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            @click="editClick(item)">
            <i class="fa fa-edit"></i>
            </button>
            <button type="button"
             v-if="Role=='Admin'"
             @click="deleteClick(item.ItemId)"
            class="btn btn-danger btn-sm">
            <i class="fa fa-trash"></i>
            </button>

        </td>
    </tr>
</tbody>
</thead>
</table>

<div class="modal fade" id="exampleModal" tabindex="-1"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg modal-dialog-centered">
<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{modalTitle}}</h5>
        <button type="button" ref="Close" class="btn-close" data-bs-dismiss="modal"
        aria-label="Close"></button>
    </div>

    <div class="modal-body">
    <div class="d-flex flex-row bd-highlight mb-3">
    <div class="row">
    <div class="col-lg-12">
    <div class="input-group">
    <span class="input-group-text">Title</span>
    <input type="text" class="form-control" v-model="Title">
    </div>
    </div>
    
    <div class="col-lg-12">
    <label for="Description">Description</label>
    <textarea class="form-control" id="Description" rows="3" v-model="Description"></textarea>
    </div>
    
    </div>


        <div class="p-2 w-50 bd-highlight">
            <img width="250px" height="250px"
                :src="PhotoPath+PhotoFileName"/>
            <input class="m-2" type="file" @change="imageUpload">
        </div>
    </div>
        <button type="button" @click="createClick()"
        v-if="ItemId==0" class="btn btn-primary">
        Create
        </button>
        <button type="button" @click="updateClick()"
        v-if="ItemId!=0" class="btn btn-primary">
        Update
        </button>

    </div>

</div>
</div>
</div>


</div>


`,

data(){
    return{
  
        Items:[],
        modalTitle:"",
        ItemId:0,
        Title:"",
        Description:"",
        PhotoFileName:"anonymous.png",
        PhotoPath:variables.PHOTO_URL,
        Role:localStorage.getItem("Role"),
    }
},
methods:{
    getConfig(){
        
        var token = localStorage.getItem("Token");
        //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZmgiLCJqdGkiOiI1MjZlODc0Yi01ZjI4LTRmMjYtOTY3ZC1lMTZlZWUwZmYyZTEiLCJlbWFpbCI6Im1maEB5YWhvby5jb20iLCJ1aWQiOiIxODAyOTE4NS02ZmEyLTQ2MDgtYTA5YS03NGYyYzhhNjg1MjEiLCJyb2xlcyI6IlVzZXIiLCJleHAiOjE2NDEyMTEwOTcsImlzcyI6IlNlY3VyZUFwaSIsImF1ZCI6IlNlY3VyZUFwaVVzZXIifQ.Svxie509x4NXMARA27npdymYnhJPgmWugRTzWPewxNc";
        const config = {
            headers: {'Authorization': 'Bearer '+token}
        };

        return config;
    },
    refreshData(){
        var token = localStorage.getItem("Token");
        
        if(token == ""){
            router.push("login");      
        }

        axios.get( 
          variables.API_URL+"Item",
          this.getConfig()
        ).then(response => {this.Items=response.data;}).catch(console.log);
    },
    addClick(){
        this.modalTitle="Add Item";
        this.ItemId=0;
        this.Title="";
        this.Description="";
        this.PhotoFileName="anonymous.png"
    },
    editClick(item){
        this.modalTitle="Edit Item";
        this.ItemId=item.ItemId;
        this.Title=item.Title;
        this.Description=item.Description;
        this.PhotoFileName=item.PhotoFileName
    },
    createClick(){
        axios.post(variables.API_URL+"Item",{
            Title:this.Title,
            Description:this.Description,
            PhotoFileName:this.PhotoFileName
        },this.getConfig())
        .then((response)=>{
            this.refreshData();
            alert(response.data);
            this.$refs.Close.click();
        });
    },
    updateClick(){
        axios.put(variables.API_URL+"Item",{
            ItemId:this.ItemId,
            Title:this.Title,
            Description:this.Description,
            PhotoFileName:this.PhotoFileName
        },this.getConfig())
        .then((response)=>{
            this.refreshData();
            alert(response.data);
            this.$refs.Close.click();
        });
    },
    deleteClick(id){
        if(!confirm("Are you sure?")){
            return;
        }
        axios.delete(variables.API_URL+"Item/"+id,this.getConfig())
        .then((response)=>{
            this.refreshData();
            alert(response.data);
        });

    },
    imageUpload(event){
        let formData=new FormData();
        
        formData.append('file',event.target.files[0]);
        axios.post(
            variables.API_URL+"Item/savefile",
            formData)
            .then((response)=>{
                this.PhotoFileName=response.data;
            });
    }

},
mounted:function(){
    this.refreshData();
}

}