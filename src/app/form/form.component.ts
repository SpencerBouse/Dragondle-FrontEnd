import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, startWith, map } from 'rxjs';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { Character } from '../characters.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.less'
})
export class FormComponent implements OnInit{
  @Input() character!: Character;
  @Input() characters!: Character[];
  @Input() state!: string | null;

  @Output() guessEvent = new EventEmitter<string>();
  @Output() goAgainEvent = new EventEmitter();
  @Output() nextEvent = new EventEmitter();

  filteredChars!: Observable<Character[]>;

  characterForm = this.formBuilder.group({
    charName: new FormControl('', Validators.required)
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.filteredChars = this.characterForm.controls['charName'].valueChanges.pipe(
      startWith(''),
      map(value=> this._filter(value || '')),
    )
  }
  private _filter(value: string): Character[] {
    return this.characters.filter(character => character.name.toLowerCase().includes(value.toLowerCase()));
  }

  onSubmit(skipped?: boolean): void {
    if(skipped){
      this.guessEvent.emit('')
    }else{
      if(this.characterForm.controls['charName'].value) this.guessEvent.emit(this.characterForm.controls['charName'].value)
    }
  }

  resetForm (){
    this.characterForm.reset()
  }
}
