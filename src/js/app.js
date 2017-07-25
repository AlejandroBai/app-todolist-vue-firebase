Vue.component('todo-list', {
  template : '#todo-template',

  data : function() {
    return {
      nuevaTarea: null,
      editandoTarea: null,
    }
  },

  props: ['tareas'],

  methods: {
    agregarTarea: function(tarea){
      this.tareas.unshift({
        // Emulo una estructura de objeto
        titulo : tarea, completado : false
      });
      this.nuevaTarea = '';
    },
    editarTarea: function(tarea){
      console.log(tarea);
    },
    
    eliminarTarea: function(index){
      // .splice se adentra en la matriz. Con el número 1 le indico que elimine la que pincho, que sería this.tarea en la matriz tareas
      // this.tareas.splice(index, 1);

      // Con $delete borro directamente de la matriz tareas aquella con el index correspondiente.
      this.$delete(this.tareas, index);
    }
  }
});

new Vue({
  el: '#app',
  data: {

    tareas: [
      {titulo: 'Salir a correr', completado: false},
      {titulo: 'Ir al gimnasio', completado: false},
      {titulo: 'Hacer la comida', completado: false},
      {titulo: 'Beber litros en la plaza', completado: false},
      {titulo: 'Quedar con Leticia', completado: false},
    ]
  },
});
