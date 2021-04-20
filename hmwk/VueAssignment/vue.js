const app = Vue.createApp({
    data: function () {
        return {
            sections: [],
            message: ''
        };

    },
    methods: {
        searchInput(){
            fetch("/users/cturner11/act311/hmwk/vueProject/classes.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            var list = []
            for (var key in data){
                if(data[key].course.toLowerCase().includes(this.message.toLowerCase())){
                    list.push(data[key])
                }
            }
            this.sections=list
            return data
        })
        .catch((err) => {
            console.log(err);
        });
        }
    },
    mounted() {
        
    },
});
app.mount("#container0");