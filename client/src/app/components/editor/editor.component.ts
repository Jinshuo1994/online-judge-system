import { Component, OnInit, Inject } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';


declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  sessionId: string;
  editor: any;
  public languages: string[] = ['Java', 'C++', 'Python'];
  language: string = 'Java';

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
        //type your code here
      }
    }`,
    'C++': `
      #include<iostream>
    `,
    'Python': `
      Class Solution:
      def exampl():
        #write your code here
    `
  }

  constructor(@Inject('collaboration') private collaboration,
              private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      })


  }

  initEditor(): void {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.getSession().setMode('ace/mode/java');
    this.editor.setValue(this.defaultContent['Java']);
    this.editor.$blockScrolling = Infinity;
    document.getElementsByTagName('textarea')[0].focus()


    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change', (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })

    this.editor.getSession().getSelection().on("changeCursor", () => {
      let cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor moves' + JSON.stringify(cursor))

      this.collaboration.cursorMove(JSON.stringify(cursor));
    })

    this.collaboration.restoreBuffer();
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.language.toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    let user_code = this.editor.getValue();
    console.log(user_code)
  }

}
