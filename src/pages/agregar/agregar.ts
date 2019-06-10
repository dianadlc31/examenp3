import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert, LoadingController, Loading } from 'ionic-angular';

import * as firebase from 'firebase';
import 'firebase/auth'
import { Camera, CameraOptions } from '@ionic-native/camera';

import {Geolocation} from '@ionic-native/geolocation'
import 'firebase/storage';


@IonicPage()
@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
})
export class AgregarPage {



  tipo ='';
  copa='';
  tronco= '';

  imagen;
  latitud;
  longitud;

 
  
  db: firebase.firestore.Firestore;
  user:firebase.User;
  storage: firebase.storage.Storage;

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtr:AlertController, public camera: Camera, private geolocation: Geolocation, public loading:LoadingController) {
    this.db = this.navParams.get('db');
    this.user = firebase.auth().currentUser;
    this.imagen =this.navParams.get('imagen');
    this.storage = firebase.storage();
    this.db= firebase.firestore();
  }

  getPicture()
  {

    console.log('tomar foto');

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitud=resp.coords.latitude ;
      this.longitud=resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    const options: CameraOptions = {
      quality:100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options)
    .then(imagen =>{
      console.log('imagen capturada');
     this.imagen='data:image/jpeg;base64,'+imagen;
    }, error=> {
      console.log(JSON.stringify(error));
    });
  } 

 
  addDocument(collection:string, obj: any){
    this.db.collection(collection).add(obj)
    .then((res) =>{
      console.log('agregado');
      let alert =this.alertCtr.create(
        {
        title:"Éxito",
        subTitle: "Se agregó el árbol a tu bosque",
        buttons: ["Ok"]
        }
      );
      alert.present();
    })
    .catch((error) =>{
      console.log('error');
      let alert =this.alertCtr.create(
        {
        title:"Error",
        subTitle: "No se pudo agregar el árbol a tu bosque",
        buttons: ["Ok"]
        }
      );
      alert.present();
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarPage');
  }
    Agregar(){
      let loading=this.loading.create({content:"Subiendo imagen..."});
      loading.present();
      console.log(this.tipo,
                  this.tronco,
                  this.copa);
      let arbol={
        tipo: this.tipo,
        copa:Number(this.copa),
        tronco:Number(this.tronco),
        foto:'',
        latitud: this.latitud,
        longitud:this.longitud,
        user: this.user.uid
      }
      this.db.collection('arboles').add (arbol)
      .then(ref=> {
      let imagenNombre=ref.id;
      let uploadTask = this.storage.ref('arboles/'+imagenNombre+'.jpg').putString(this.imagen, 'data_url');
      uploadTask.then(out=>{loading.dismiss();
        let url = out.downloadURL;
        ref.update({url:url});
        this.navCtrl.pop();
    })
    .catch(error=>{
      console.log('Error al subir la imagen');
    });
    })
    .catch(error=>{
      console.log(JSON.stringify(error))
    })

}
}
