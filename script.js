const firebaseConfig = {
  apiKey: "AIzaSyAMOrFP92MTJbVw-ia4DH06InnAwGlt32w",
  authDomain: "crudelectivaiv.firebaseapp.com",
  databaseURL: "https://crudelectivaiv-default-rtdb.firebaseio.com",
  projectId: "crudelectivaiv",
  storageBucket: "crudelectivaiv.appspot.com",
  messagingSenderId: "807107545407",
  appId: "1:807107545407:web:eb1b6274f610da083dab8a"
};

firebase.initializeApp(firebaseConfig);

//Persistencia de datos de firebase
firebase.database().ref().on('value', function() {});


let db = firebase.database();
let tareaRef = db.ref("tarea");


  const tarea = document.getElementById('tarea');
  const studentListForm = document.getElementById('studentList');

 ///////////////////////////////////////////////////////////
  if (!navigator.onLine) {
  firebase.database().goOffline();
  alert('Estás trabajando de manera local sin conexión a Internet. Los cambios se almacenarán localmente y se sincronizarán cuando haya conexión nuevamente.');
}
///////////////////////////////////////////////////////////

   

let contador = parseInt(localStorage.getItem('contador') || '0'); // Obtener el valor del contador y convertirlo a número
  // Función para agregar un tareaa
 function addStudent(event) {

  const registro = tarea.value;
  

  const tareaData = {
   tarea:registro
  };

  if (navigator.onLine) {
    event.preventDefault();
    alert( tarea.value,'Tarea Asignada');

    // Supuestamente este es el método para agregar un registro
    let estudentInsert = tareaRef.push(tareaData);
  } else {
    event.preventDefault();

    contador++; // Incrementar el contador
    localStorage.setItem('contador', contador); // Almacenar el nuevo valor del contador en el localStorage

    localStorage.setItem(contador.toString(), JSON.stringify(tareaData)); // Almacenar los datos del tareaa usando el contador como clave
  }
}

///////////////////////////////////////////////////////////
//funcion para mostrar tareaas
function mostrar(){
   
    // Referencia a la collección de tareaas
const tareaRef = db.ref("tarea");

  while (studentListForm.firstChild) {
    studentListForm.removeChild(studentListForm.firstChild);
  }
// Detectar cambios en los datos
tareaRef.on("value", function(snapshot) {
studentListForm.innerHTML = "";

  //snapshot es los datos actuales

  snapshot.forEach(function(child){
    
    // child son los hijos (cada registro)

    let tareaa = child.val();
    
    let formulario = document.querySelector(`form[data-id="${child.key}"]`);
 
    if (!formulario){

    let form = document.createElement('form');
    form.classList.add('form');
    form.setAttribute('data-id',child.key);
    let fragmento = document.createDocumentFragment();
    

    let div1 = document.createElement('div');
    let div2 = document.createElement('div');

    let label1 = document.createElement('label');
    

    let input1 = document.createElement('input');
  

    let buttonUpdate = document.createElement('input');
    let buttonDelete = document.createElement('input');
    
    buttonUpdate.type='submit';
    buttonDelete.type='button';

    buttonUpdate.value='actualizar';
    buttonDelete.value='Eliminar';

    buttonUpdate.style='cursor:pointer';
    buttonDelete.style='margin-left:.5rem;cursor:pointer';

    label1.innerHTML=`Tarea`;

    input1.type='text';
  
    input1.style='border:none';
  
    input1.value=`${tareaa.tarea}`;

    // Agregar el atributo data con el id del tareaa (muy util chaval)

    input1.setAttribute('data-id',child.key);

    //Agregar name a cada input
    // Establecer el atributo name
    input1.setAttribute('name', 'tarea');
    
    

    div1.style='display:flex;justify-content:center;aling-items:center';
    div2.style='display:flex;justify-content:center;aling-items:center';

    div1.append(label1);
    div1.append(input1);
    
    div2.append(buttonUpdate);
    div2.append(buttonDelete);

    
    form.append(div1);
    form.append(div2);
    
    
    studentListForm.append(form);
  
      //////////////////////////////////////////////////////////////
    form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const id = input1.getAttribute('data-id');
   
    const formData = new FormData(form);

    const tareaC = formData.get('tarea');
  
    
    const datos={
      tarea:tareaC
    }

      let ref = db.ref("tarea/" + id);
      await ref.update(datos);
      alert('¡¡datos actualizados!!');
      
     });
    //////////////////////////////////////////////////////
    buttonDelete.addEventListener('click', () => {

    let id = input1.getAttribute('data-id');
  
    // Referencia al registro
    let ref = db.ref(`tarea/${id}`);

    ref.remove()
    .then(() => {

      alert("Eliminado exitosamente!");
    })
    .catch((error) => {
      formulario.remove();
      console.log(error); 
    });

    });
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    }else{
       const inputs = formulario.getElementsByTagName("input");
        inputs[0].value = tareaa.tarea;
      
    }

  });

});
   
}
/////////////////////////////////////////////////////////////////
////////////////////////////////////  
/////////////////////////////////////
////////////////////////////////////
///////////////////////////////////////////////////////
studentForm.addEventListener('submit', addStudent);

///////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', () => {
  if (navigator.onLine) {
    mostrar();
  } else {
    alert('No tienes conexión a internet');
  }
});