<template>
    <div class="modal-backdrop">
      <div class="modal">
        <v-card>

          <!-- Add Task Panel Header -->
          <v-card-title class='headline primary justify-center' primary-title style='color: white;'>
            <div v-if="isAddTask" key="addA">
              <span class="fa-solid fa-circle-plus"/> &nbsp; Add Task
            </div>
            <div v-else key="updateA">
              <span class="fa-solid fa-pen-to-square"/> &nbsp; Edit Task
            </div>
            
          <!-- Add Task Panel Body -->
          </v-card-title>

            <!-- Form Validation -->
            <v-form ref="form" lazy-validation>

              <!-- Title -->
              <v-layout v-if="isAddTask" justify-center class="elements mx-5 mb-0 mt-7" >
                <v-text-field label="Title" outlined v-model="title" 
                  :rules="[v => !!v || 'Title is a required field.']" required />
              </v-layout>

              <!-- Description -->
              <v-layout justify-center class="element mx-5 my-2">
                <v-text-field label="Description" outlined v-model="description"
                  :rules="[v => !!v || 'Description is a required field.']" required />
              </v-layout>

              <!-- Deadline -->
              <v-layout justify-center class="elements mx-5 my-0">
                <v-menu ref="menu" :close-on-content-click="false" :return-value.sync="deadline" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="deadline" label="Deadline" append-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                      :rules="[v => !!v || 'Deadline is a required field.']" required />
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-layout>

              <!-- Priority -->
              <v-radio-group label="Priority" class="elements mx-4 my-0" v-model="priority">
                  <v-layout align-start row d-flex justify-space-between>
                    <v-radio label="Low" value="low"/>  &nbsp;
                    <v-radio label="Med" value="med" />  &nbsp;
                    <v-radio label="High" value="high" />
                  </v-layout>
              </v-radio-group>

              <!-- Submission Buttons-->
              <v-layout justify-end class="elements mx-2 mt-0 mb-2">

                <!-- Add -->
                <div v-if="isAddTask" key="addB" >
                  <v-btn color="primary" elevation="2" @click="addTask" class="mr-2">  
                      <i class="fa-solid fa-circle-plus"></i> ADD 
                  </v-btn>
                </div>
                <div v-else key="updateB">
                  <v-btn color="primary" elevation="2" @click="updateTask" class="mr-2"> 
                      <i class="fa-solid fa-pen-to-square"></i> EDIT
                  </v-btn>
                </div>

              <!-- Cancel -->
              <v-btn color="error" elevation="2" @click="close"> <span class="fa-solid fa-ban"/> CANCEL</v-btn>
              </v-layout>
            </v-form>
          </v-card>
      </div>
    </div>
  </template>



<!-- This is the script that Vue uses. -->
  <script>
  export default {
    name: 'Modal-Test',
    props: {
      isModalVisible: Boolean,
      isAddTask: Boolean,
      existing_description: String,
      existing_deadline: String,
      existing_priority: String,
      tasks: Array
    },
    watch:{
      isModalVisible(newVal){
        this.$refs.form.resetValidation();
        if(newVal && !this.isAddTask){
          this.getParentData();
        }
      },
      deadline() {
        if(this.deadline.includes("-")){
          this.deadline = this.formatDate(this.deadline)
        }
      },
    },
    methods: {
      addTask(){
        if(this.$refs.form.validate()){
          this.$emit('addTask', this.title, this.description, this.deadline, this.priority);
          this.clear();
          this.close();
        }
      },
      updateTask(){
        if(this.$refs.form.validate()){
          this.$emit('updateTask', this.description, this.deadline, this.priority);
          this.clear();
          this.close();
        }
      },
      close() {
        this.clear();
        this.$emit('close');
      },
      clear(){
        this.title='';
        this.description='';
        this.deadline='';
        this.priority='low';
        this.$refs.form.resetValidation();
      },
      formatDate(date){
        if (!date) return null;
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
      },
      getParentData(){
        this.description=this.existing_description;
        this.deadline=this.existing_deadline;
        this.priority=this.existing_priority;
      },
      checkValidTitle(title){
        return !this.tasks.filter(e => e.title === title).length > 0
      }
    },
    data(){
      return{
        title: '',
        description: '',
        deadline: '',
        priority: 'low',
        date:'',
        titleRules: [
        v => !!v || 'Title is a required field.',
        v => this.checkValidTitle(v) || 'This title is the same as another title in the table.',
      ],
      }
    }
  };
</script>

<!-- Displays the "Add" menu as a popup -->
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
  .elements{
    margin:10px 10px;
    padding:0px;
  }
</style>