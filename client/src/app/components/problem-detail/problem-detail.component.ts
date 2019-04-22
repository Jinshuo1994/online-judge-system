import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from "../../models/problem.model";
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
      this.data.getProblem(+param["id"])
        .then(problem => this.problem = problem);
    });
  }

}
