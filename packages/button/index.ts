import wkButton from "./index.vue";
wkButton.install=(app:any)=>{
    app.component(wkButton.name,wkButton)
}
export default wkButton