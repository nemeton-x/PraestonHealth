import { Component, OnInit } from "@angular/core";
import { DashboardService } from "./dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public myQuestionaier = [];
  public surveyResult = [];
  public quesAnsModel = {};

  public responseToSave = [];
  public finalMsg;
  // public formattedResponse = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getFirstQuestionaire();
  }

  selectAns(questionId, answer) {
    // let answerKeys = [
    //   { answerKey: ["Alcoholic", "Heavy drinker", "Social drinker"] },
    //   { answerKey: ["Beers", "Wines", "Spirits"] },
    //   { answerKey: ["Alcoholic", "Heavy drinker"] }
    // ];
    document.getElementById(questionId + answer).style.border =
      "2px solid #b7d433";
    document.getElementById(questionId + answer).style.border =
      "2px solid #b7d433";
    let hasResponse = false;
    this.responseToSave.forEach((resp, index) => {
      if (resp.questionId == questionId) {
        hasResponse = true;
        this.responseToSave[index].answer = answer;
        return;
      }
    });
    if (!hasResponse) {
      this.responseToSave.push({ questionId: questionId, answer: answer });
    }
  }

  getNextQuestionaire() {
    let formattedResponse = [];
    let categoryId = this.myQuestionaier[0].category_id + 1;
    this.myQuestionaier.forEach(item => {
      if (this.quesAnsModel && this.quesAnsModel[item.qus_id]) {
        let answerResp = [];
        item.answers.forEach(ansChoice => {
          if (
            item.option_type == "radio" &&
            ansChoice.option_id == this.quesAnsModel[item.qus_id]
          ) {
            answerResp.push({
              option_id: ansChoice.option_id,
              option_text: ansChoice.option_text
            });
          } else if (item.option_type == "Text Box") {
            answerResp.push({
              option_id: ansChoice.option_id,
              option_text: this.quesAnsModel[item.qus_id]
            });
          }
        });

        formattedResponse.push({
          qus_id: item.qus_id,
          qus_statement: item.qus_statement,
          category: item.category_id,
          answers: answerResp
        });
      }
    });

    this.dashboardService
      .getNextQuestionaire(formattedResponse, categoryId)
      .subscribe(
        resp => {
          console.log("resp");
          console.log(resp);
          if (resp == "d") {
            this.finalMsg = "Congratulation! for submitting questionaiere";
            this.myQuestionaier = [];
          } else if (resp && resp.length > 0) {
            this.myQuestionaier = this.arrangeMyQuestionaier(resp);
          }
        },
        err => {
          if (err == "d") {
            this.finalMsg = "Congratulation! for submitting questionnaire";
            this.myQuestionaier = [];
          }
        }
      );
  }

  getFirstQuestionaire() {
    this.dashboardService.getMyQuestions().subscribe(resp => {
      console.log("resp");
      console.log(resp);
      if (resp) {
        this.myQuestionaier = this.arrangeMyQuestionaier(resp);
      }
    });
  }

  arrangeMyQuestionaier(questions) {
    let returnQuestions = [];
    questions.forEach(ques => {
      if (!ques.dep_question_id) {
        returnQuestions.push(ques);
        questions.forEach(quesList => {
          if (quesList.dep_question_id == ques.qus_id) {
            returnQuestions.push(quesList);
          }
        });
      }
    });
    return returnQuestions;
  }
}
