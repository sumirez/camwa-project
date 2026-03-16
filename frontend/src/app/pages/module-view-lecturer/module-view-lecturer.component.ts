import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActionTableComponent } from 'src/app/components/action-table/action-table.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { PopupAddModuleComponent } from 'src/app/components/popup-add-module/popup-add-module.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'module-view-lecturer',
  standalone: true,  // Đánh dấu RequestComponent là standalone
  imports: [CommonModule, ActionTableComponent, PopupAddModuleComponent,RouterModule,RouterLink, RouterOutlet],  // Import thư viện cần thiết
  templateUrl: './module-view-lecturer.component.html',
  styleUrls: ['./module-view-lecturer.component.scss']
})
export class ModuleViewLecturerComponent {  
  // public id! : string;
  // public name! : string;
  // public program! : string;
  // public semester! : string;
  // public intake! : number;
  // public lecturer! : string;
  // public studentCount! : number;
  
  constructor() { }

  // ngOnInit(): void {
  //   this.getModules();
  // }

  // getModules(){
  //   this.http.get<any>('http://localhost:3000/api/module/IM001/export-report').subscribe(
  //     response => {
  //       console.log(response);
  //       this.modules = response;
  //     }
  //   );
  // }

  // modules = [];

  modules= [
    {
      id: "CS1",
      name: "Theoretical Computer Science",
      program: "CSE",
      semester: "WS 2024",
      intake: 2022,
      lecturer: "Lecturer 1",
      studentCount: 4,
    },
    {
      id: "CS2",
      name: "Discrete Math",
      program: "CSE",
      semester: "WS 2024",
      intake: 2022,
      lecturer: "Lecturer 2",
      studentCount: 4,
    },
    {
      id: "EEIT1",
      name: "Electrical Circuits",
      program: "EEIT",
      semester: "WS 2024",
      intake: 2022,
      lecturer: "Lecturer 3",
      studentCount: 4,
    },
    {
      id: "EEIT2",
      name: "Digital Signal Processing",
      program: "EEIT",
      semester: "WS 2024",
      intake: 2022,
      lecturer: "Lecturer 4",
      studentCount: 4,
    },
  ];
}
