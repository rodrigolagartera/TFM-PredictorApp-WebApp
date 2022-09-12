import {getPrediction, updatePrediction, deletePrediction} from './firebase.js'

const predictionsForm = document.getElementById('predictions-form')

predictionsForm.addEventListener('submit', (e) => {
    e.preventDefault()

    
})

window.addEventListener('DOMContentLoaded', async() =>{
    var idPrediction = document.location.search.split('idPrediction=')[1]
    const prediction = await getPrediction(idPrediction)

    if (prediction.data() == null){
        let html = ''
        html += `
            <div>
                <h3>No existen predicciones para el dato ${idPrediction}</h3>
            </div>
        `
        predictionsForm.innerHTML = html;
    }
    else{
        const tituloContainer = document.getElementById('titulo')
        let html = ''
        html += `<h3>Fecha: ${timeConverter(idPrediction)}</h3>`
        tituloContainer.innerHTML = html;
        predictionsForm['diagnostico'].value = prediction.data().diagnose
        predictionsForm['porcentaje'].value = prediction.data().percentage
        predictionsForm['posible_diagnostico'].value = prediction.data().comments

        const btnsEditPred = predictionsForm.querySelectorAll('.btn-editarPred')
        btnsEditPred.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                updatePrediction(idPrediction, {
                    diagnose: predictionsForm['diagnostico'].value,
                    percentage: predictionsForm['porcentaje'].value,
                    comments: predictionsForm['posible_diagnostico'].value
                });
            })
            
        })

        const btnsDeletePred = predictionsForm.querySelectorAll('.btn-borrarPred')
        btnsDeletePred.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                deletePrediction(idPrediction)

                //location.reload()
            })
        })
    }
   
});

function timeConverter(timestamp){
    var a = new Date(timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = String(a.getHours());
    var min = String(a.getMinutes());
    var sec = String(a.getSeconds());
    if (hour.length==1){
        hour = 0 + hour;
    }
    if (min.length==1){
        min = 0 + min;
    }
    if (sec.length==1){
        sec = 0 + sec;
    }
    var time =  year + '-' + month + '-' + date + '--' + hour + ':' + min + ':' + sec ;
    return time;
  }







