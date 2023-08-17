import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Post } from '../models/post';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router) { }


  uploadImage( selectedImage:File, postData, formStatus, id){
    const  filePath =`postIMG/${Date.now()}`;
     console.log(filePath);

     this.storage.upload(filePath, selectedImage).then(() =>{
      console.log("post image Uploaded Successfully");

      this.storage.ref(filePath).getDownloadURL().subscribe(URL =>{
        postData.postImgPath = URL;

        if(formStatus == "Edit"){
          this.updateData(id, postData);
        }else{
          this.saveData(postData);
        }
      })
     })
  }

  saveData(postData){
    this.afs.collection('posts').add(postData).then( docRef =>{
      this.toastr.success("Data Inserted Successfully");
      this.router.navigate(['/posts'])
    })
  }

  loadData(){
    return this.afs.collection("posts").snapshotChanges().pipe(
       map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data(); 
          const id = a.payload.doc.id;
          return { id, data }
         })
       }))
   }

   loadOneData(id){
    return this.afs.doc(`posts/${id}`).valueChanges();
   }

   updateData(id , postData){
    this.afs.doc(`posts/${id}`).update(postData).then(()=>{
      this.toastr.success("Data Updated Successfully");
      this.router.navigate(['/posts'])
    })
   }

   deleteImage(postImgpath, id){
      this.storage.storage.refFromURL(postImgpath).delete().then(() =>{
        this.deleteData(id)
      })
   }

   deleteData(id){
    this.afs.doc(`posts/${id}`).delete().then(() =>{
      this.toastr.warning("Data Deleted...!");
    })
   }

   markFeatured(id , featuredData){
    this.afs.doc(`posts/${id}`).update(featuredData).then( () =>{
      this.toastr.info("Featured Status Updated");
    })
   }
}
