import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class DashboardService {
  constructor(private _http: HttpClient) {}

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      // "Accept": "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    return new HttpHeaders(headersConfig);
  }

  getMyQuestions(): Observable<any> {
    let answerKeys = [
      { answerKey: ["Alcoholic", "Heavy drinker", "Social drinker"] },
      { answerKey: ["Beers", "Wines", "Spirits"] },
      { answerKey: ["Alcoholic", "Heavy drinker"] }
    ];
    let catchedError: any;
    return this._http
      .get("http://10.131.85.62/Api/Questions/1/en", {
        headers: this.setHeaders()
      })
      .map(res => {
        // let returnArray = [];
        // for (let key in res) {
        //   if (res[key] && res[key].answer_data) {
        //     res[key].answer_data = res[key].answer_data.map(function(
        //       item,
        //       index
        //     ) {
        //       return {
        //         answer: item[Object.keys(item)[0]],
        //         answerkey: answerKeys[key] ? answerKeys[key].answerKey[index] : ""
        //       };
        //     });
        //     returnArray.push(res[key]);
        //   }
        // }
        if (res) {
          return res["questions"];
        }
        return [];
      })
      .catch((error: any) => (catchedError = error));
  }

  getNextQuestionaire(body, categoryId): Observable<any> {
    let prepareBody = JSON.stringify({
      UserId: "1",
      status: "ok",
      questions: body
    });
    // let answerKeys = [
    //   { answerKey: ["Alcoholic", "Heavy drinker", "Social drinker"] },
    //   { answerKey: ["Beers", "Wines", "Spirits"] },
    //   { answerKey: ["Alcoholic", "Heavy drinker"] }
    // ];
    let catchedError: any;
    return (
      this._http
        .post(
          "http://10.131.85.62/Api/Questions/Save/" + categoryId,
          prepareBody,
          { headers: this.setHeaders() }
        )
        // .post("http://10.131.85.62/Api/Questions/Save/2", prepareBody)

        .map(res => {
          // let returnArray = [];
          // for (let key in res) {
          //   if (res[key]) {
          //     returnArray.push(res[key]);
          //   }
          // }
          if (res) {
            return res["questions"];
          }
          return [];
        })
        .catch((error: any) => {
          if (error.status && error.error == "No Category Found") {
            return "d";
          }
          return error;
        })
    );
  }
}
