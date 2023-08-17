import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from '../services/categories.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray:Array<any>;
  formCategory:string;
  formStatus : string ="Add";
  categotyId : string ;

  constructor( private categoryService : CategoriesService ) { }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe( val =>{
      console.log(val);
      this.categoryArray = val
    })
  }


  onSubmit(formData:any){

    let categoryData : Category = {
      category: formData.value.category
    }


    if( this.formStatus == "Add"){
      this.categoryService.saveData(categoryData)
      formData.reset();
    }
    else if(this.formStatus == "Edit"){
      this.categoryService.updateData( this.categotyId , categoryData);
      formData.reset();
      this.formStatus = "Add";

    }
   
  }


  onEdit(category, id){
     this.formCategory = category;
     this.formStatus = "Edit" ;
     this.categotyId = id ;
  }


  onDelete(id){
    this.categoryService.deleteData(id)
  }

}
