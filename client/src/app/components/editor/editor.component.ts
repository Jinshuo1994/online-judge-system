import { Component, OnInit, Inject } from '@angular/core';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

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

  constructor(@Inject('collaboration') private collaboration) {

  }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.getSession().setMode('ace/mode/java');
    this.editor.setValue(this.defaultContent['Java']);
    this.editor.$blockScrolling = Infinity;
    this.collaboration.init();
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
