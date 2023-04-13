<template>
<v-app style='margin:30px'>
    <v-card>

    <!--Top of Page-->
        <v-card-title class='headline primary justify-center' primary-title style='color: white;'>
            <v-spacer />
                <span class="fa-solid fa-bars" /> &nbsp; FRAMEWORKS
            <v-spacer />
            <v-btn color="primary" elevation="2" large @click="addTaskModal"> <span class="fa-solid fa-circle-plus"/> ADD </v-btn>
        </v-card-title>
    
        <!--Body of the Top Panel-->
        <v-simple-table style='margin: 20px;'>
            <template v-slot:default>
            
            <!--Table Headers-->
                <thead>
                    <tr>
                        <th class="column text-center"> Title </th>
                        <th class="column text-center"> Description </th>
                        <th class="column text-center"> Deadline </th>
                        <th class="column text-center"> Priority </th>
                        <th class="column text-center"> Is Complete </th>
                        <th class="column text-center"> Action </th>
                    </tr>
                </thead>
                
            <!--Table Body-->
                <tbody>
                    <tr v-for="(task,index) in tasks" :key="index">
                        <td class="text-center">{{task.title}}</td>
                        <td class="text-center">{{task.description}}</td>
                        <td class="text-center">{{task.deadline}}</td>
                        <td class="text-center">{{task.priority}}</td>
                        <td> 
                            <v-layout justify-center>
                                <v-checkbox v-model="tasks[index].isComplete"/> 
                            </v-layout>
                        </td>
                        <td>
                            <v-layout justify-center v-if="!tasks[index].isComplete">
                                <v-btn class="button mt-2" color="primary" elevation="2" large @click="updateTaskModal(index)">
                                    <span class="fa-solid fa-pen-to-square"/> UPDATE </v-btn>
                            </v-layout>
                            <v-layout justify-center>
                                <v-btn class="button mb-2" color="error" elevation="2" large @click="deleteTask(index)">
                                    <span class="fa-solid fa-circle-xmark"/> DELETE </v-btn>
                            </v-layout>
                        </td> 
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>

    <Modal
      v-show="isModalVisible"
      :isModalVisible=isModalVisible
      :isAddTask=isAddTask
      :existing_description=description
      :existing_deadline=deadline
      :existing_priority=priority
      :tasks=tasks
      @addTask="addTask"
      @updateTask="updateTask"
      @close="closeModal"
    />

</v-app>
</template>

<!-- This is the script that Vue uses. -->
<script>
import Modal from './Modal.vue';
    export default {
        name:'ToDo',
        components:{
            Modal,
        },

    // All methods
        methods: {
            // Methods that update the form
            addTaskModal(){
                this.isAddTask = true;
                this.showModal();
            },
            updateTaskModal(index){
                this.taskIndex = index;
                this.isAddTask = false;
                this.description = this.tasks[this.taskIndex].description;
                this.deadline = this.tasks[this.taskIndex].deadline;
                this.priority = this.tasks[this.taskIndex].priority;
                this.showModal();
            },
            deleteTask(index){
                this.tasks.splice(index, 1);
                this.$toasted.success("You have successfully deleted the task.");
            },


            // Methods that modify form components
            addTask(title, description, deadline, priority){
                this.tasks.push({
                    title:title,
                    description:description,
                    deadline:deadline,
                    priority:priority,
                    isComplete:false,
                });
                this.$toasted.success("You have successfully added the task.");
            },
            updateTask(description, deadline, priority){
                this.tasks[this.taskIndex].description = description;
                this.tasks[this.taskIndex].deadline = deadline;
                this.tasks[this.taskIndex].priority = priority;
                this.$toasted.success("You have successfully updated the task.");
            },


            // Visible/invisible modal methods
            showModal() {
                this.isModalVisible = true;
            },
            closeModal() {
                this.isModalVisible = false;
            }
        },

    // All global variables
        data() {
            return {
                isModalVisible: false,
                isAddTask: true,
                taskIndex: null,
                title:'',
                description:'',
                deadline:'',
                priority:'low',
                tasks:[],
            };
        },
            created(){},
            watch: {},
            computed: {},
    }
</script>