import {getClinicalDetails, deleteData, onGetData, getPrediction, getClinicalDetail, deletePrediction, getUrlImage, addVerifiedData} from './firebase.js'

const clinicalDetailsContainer = document.getElementById('clinicalDetails-container')
const clinicalDetailsForm = document.getElementById('clinicalDetails-form')
const buttonGetData = document.getElementById('getData')

window.addEventListener('DOMContentLoaded', async() =>{
    onGetData((clinicalDetails) => {
        let html = ''
        clinicalDetails.forEach(doc => {
            const clinicalDetail = doc.data();
            const photoDetails = clinicalDetail.list_photo_details;
            
            html += `
                <div style="margin-left: 25%; margin-right: 25%; margin-bottom: 3%; padding:1%; border: thin solid black; background-color: gainsboro">
                    <h3>Fecha: ${timeConverter(clinicalDetail.id_timestamp)}</h3>
                    <h4>Email doctor: ${clinicalDetail.email}</h4>
                    <p>Edad: ${clinicalDetail.age}</p>
                    <p>Género: ${clinicalDetail.gender}</p>
                    <p>Tabaco: ${clinicalDetail.tobacco}</p>
                    <p>Numero de cigarrillos al dia: ${clinicalDetail.number_cigarettes}</p>
                    <p>Alcohol: ${clinicalDetail.alcohol}</p>
                    <p>Numero de dosis de alcohol: ${clinicalDetail.number_alcohol}</p>
                    <p>Drogas: ${clinicalDetail.drugs}</p>
                    <p>Comorbilidades: ${clinicalDetail.comorbidities}</p>
                    <h4>Detalles de las fotos: <h4>
            `
            let claves = Object.keys(photoDetails);
            for(let i=0; i< claves.length; i++){
                let clave = claves[i];
                const photoDetail = photoDetails[clave];
                const img = atob(photoDetail.img);
                const src_img = "data:image/jpg;base64,"+photoDetail.img;
                //src_img = imageUrl;
                let imgName = String(clinicalDetail.id_timestamp) + "_" + String(Number(clave) + 1 + ".jpg");
                
                html += `
                    <h5>Foto: ${Number(clave) + 1}</h4>
                    <p>Localización: ${photoDetail.localization}</p>
                    <p>Forma: ${photoDetail.shape}</p>
                    <p>Color: ${photoDetail.colour}</p>
                    <p>Tamaño (mm2): ${photoDetail.size}</p>
                    <p>Único: ${photoDetail.unique}</p>
                    <p>Múltiple: ${photoDetail.multiple}</p>
                    <p>Bordes: ${photoDetail.edges}</p>
                    <p>Ulcerado: ${photoDetail.ulcerated}</p>
                    <p>Mezclado: ${photoDetail.mixed}</p>
                    <p>Consistencia: ${photoDetail.consistency}</p>
                    <p>Periodo de evolución: ${photoDetail.evolution_time}</p>
                    <p>Dolor: ${photoDetail.pain}</p>
                    <p>Ganglios linfáticos cervicales: ${photoDetail.cervical_lymph_nodes}</p>
                    <div class="seePic-container" id="${imgName}"></div>
                    <button class='btn-seePic' data-id="${imgName}" style="margin-bottom:3%">Ver foto</button>
                `

                    
            }
                
            
            html +=`
            <button class='btn-delete' data-id="${doc.id}">Eliminar</button>
            <button class='btn-prediction' data-id="${doc.id}">Ver predicción</button>
            <button class='btn-almacenar' data-id="${doc.id}">Almacenar</button>
            </div>`

        });
        
        clinicalDetailsContainer.innerHTML = html;

        const btnsSeePic = clinicalDetailsContainer.querySelectorAll('.btn-seePic')
        btnsSeePic.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                e.preventDefault()
                
                let imgHtml=''
                try {
                    let urlImage = await getUrlImage(e.target.dataset.id);
                    imgHtml = `<a href="index.html" class="button">Volver</a>
                    <div style="text-align: center; margin-left: 25%; margin-right: 25%; margin-bottom: 3%; border: thin solid black; background-color: gainsboro">
                        <h3>Imagen ${e.target.dataset.id}</h3>
                        <img src=${urlImage} style="padding: 5%" width="400" height="400">
                    </div>`
                } catch (error) {
                    imgHtml = `<a href="index.html" class="button">Volver</a>
                    <h3>Imagen ${e.target.dataset.id}</h3>
                    <p>No se ha podido cargar la imagen</p>`

                }
                clinicalDetailsContainer.innerHTML = imgHtml
            })
        })

        const btnsDelete = clinicalDetailsContainer.querySelectorAll('.btn-delete')
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                deleteData(e.target.dataset.id)
            })
        })

        const btnsVerPredicion = clinicalDetailsContainer.querySelectorAll('.btn-prediction')
        btnsVerPredicion.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                e.preventDefault()
                postData(e.target.dataset.id)

            })
        })

        const btnsAlmacenar = clinicalDetailsContainer.querySelectorAll('.btn-almacenar')
        btnsAlmacenar.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                e.preventDefault()
                const prediction = await getPrediction(e.target.dataset.id)
                const clinicalDet = await getClinicalDetail(e.target.dataset.id)
                const photoDet = clinicalDet.data().list_photo_details;
                
                let forecast = '';
                let patient_code_number = '';
                if (prediction.data() != null){
                    if (prediction.data().diagnose == "Benigno"){
                        forecast = "0"
                    }
                    else if (prediction.data().diagnose == "Potencialmente maligno"){
                        forecast = "1"
                    }
                    else if (prediction.data().diagnose == "Maligno"){
                        forecast = "2"
                    }
                    patient_code_number = String(prediction.data().comments);
                }

                const verifiedMap = new Map();
                verifiedMap.set('forecast', forecast)
                verifiedMap.set('patient_code_number', patient_code_number)
                verifiedMap.set('age', clinicalDet.data().age)
                verifiedMap.set('gender', clinicalDet.data().gender)
                verifiedMap.set('tobacco', clinicalDet.data().tobacco)
                verifiedMap.set('number_of_cigaretes_day', String(clinicalDet.data().number_of_cigaretes_day))
                verifiedMap.set('alcohol', clinicalDet.data().alcohol)
                verifiedMap.set('dose_of_alcohol_day', String(clinicalDet.data().dose_of_alcohol_day))
                verifiedMap.set('drugs', clinicalDet.data().drugs)
                verifiedMap.set('comorbidities', clinicalDet.data().comorbidities)
                
                let imgDetails = []
                let claves = Object.keys(photoDet);
                let row =''
                for(let i=0; i< claves.length; i++){
                    let clave = claves[i];
                    const photoDetail = photoDet[clave];

                    const detailsImg = new Map();
                    detailsImg.set('localization', photoDetail.localization)
                    detailsImg.set('shape', photoDetail.shape)
                    detailsImg.set('colour', photoDetail.colour)
                    detailsImg.set('size_mm2', photoDetail.size)
                    detailsImg.set('unique', photoDetail.unique)
                    detailsImg.set('multiple', photoDetail.multiple)
                    detailsImg.set('edges', photoDetail.edges)
                    detailsImg.set('indurated_edges', photoDetail.indurated_edges)
                    detailsImg.set('exophytic', photoDetail.exophytic)
                    detailsImg.set('ulcerated', photoDetail.ulcerated)
                    detailsImg.set('mixed', photoDetail.mixed)
                    detailsImg.set('consistency', photoDetail.consistency)
                    detailsImg.set('pain', photoDetail.pain)
                    detailsImg.set('cervical_lymph_nodes', photoDetail.cervical_lymph_nodes)
                    const convertedDetailsMap = Object.fromEntries(detailsImg);
                    imgDetails.push(convertedDetailsMap)
                }

                verifiedMap.set('list_photo_details', imgDetails)
                const convertedMap = Object.fromEntries(verifiedMap);
                console.log(convertedMap)
                addVerifiedData(clinicalDet.data().id_timestamp, convertedMap)
                
            })
        })

    });
});


buttonGetData.addEventListener('showData', (e) => {
    //e.preventDefault()
    console.log('pulsado')
})


function postData(value){
    document.getElementById("idPrediction").value = value;
    console.log(document)
    document.getElementById("clinicalDetails-form").submit();
}

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
  
async function foo(nombreImg) {
    let imgHtml = '';
    try {
        let urlImage = await getUrlImage(nombreImg);
        imgHtml = `<img src=${urlImage}>`
        //console.log(`Obtenido el resultado final: ${urlImage}`);
    } catch(error) {
        //console.log("error");
        imgHtml = `<p>No se ha podido cargar la imagen</p>`
    }
    return imgHtml;
}

