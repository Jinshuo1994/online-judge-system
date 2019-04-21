import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from "../../models/problem.modal";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {

  problem: Problem;
  constructor(
    @Inject("data") private data,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.problem = this.data.getProblem(+param["id"]);
    });
  }

}
