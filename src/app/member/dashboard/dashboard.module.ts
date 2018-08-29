import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

// import { QuestionaireComponent } from './questionaire/questionaire.component';
import { DashboardComponent } from "./dashboard.component";
import { routing } from "./dashboard.routing";
import { DashboardService } from "./dashboard.service";

@NgModule({
  imports: [CommonModule, routing, FormsModule],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule {}
