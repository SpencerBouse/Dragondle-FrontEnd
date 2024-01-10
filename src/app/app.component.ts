import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';

import { FormComponent } from './form/form.component';
import { InfoComponent } from './info/info.component';
import { ImageComponent } from './image/image.component';
import { Character, CharactersService } from './characters.service';
import dummyCharacters from '../assets/dummy_data.json'


@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatToolbarModule,
    MatDividerModule,
    FormComponent, 
    InfoComponent, 
    ImageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'Dragondle'
  state: string | null = null
  characters!: Character[];
  remainingChars!: Character[]
  character!: Character;
  health: number = 4;

  @ViewChild(FormComponent)
  private formComponent!: FormComponent;

  constructor( private charactersService: CharactersService ) {}

  async ngOnInit(): Promise<void> {
    this.charactersService.watch().valueChanges.pipe(untilDestroyed(this), map(result => result.data.characters)).subscribe(
      data=>{
        this.characters = [...data]
        this._afterFetch(this.characters)
      },
      error=>{
        // catch error if apollo server is down, set dummy data
        // for use without the mongodb server
        console.log(error)
        this.characters = [...dummyCharacters]
        this._afterFetch(this.characters)
      }
    )
  }

  private _afterFetch(characters: Character[]){
    const storedChars = localStorage.getItem('remainingChars')
    const storedChar = localStorage.getItem('character')

    this._setRemainingChars(storedChars ? JSON.parse(storedChars) : characters)

    if(storedChar) {
      this.character = JSON.parse(storedChar)
    }else{
      this.character = this._newCharacter(storedChars ? JSON.parse(storedChars) : characters)
    }
  }

  private _setRemainingChars(characters: Character[]) {
    this.remainingChars = [...characters]
    localStorage.setItem('remainingChars', JSON.stringify(characters))
  }

  private _newCharacter(characters: Character[]): Character {
    const character = characters[Math.floor(Math.random() * characters.length)]
    localStorage.setItem('character', JSON.stringify(character))
    return character
  }

  submitGuess(characterName: String) {
    if(this.character.name.toLowerCase() === characterName.toLowerCase()){
      localStorage.setItem('character', '')
      this.state = 'win'
    }else{
      this._wrongGuess()
    }
  }

  private _wrongGuess(){
    this.health--;
    if(!this.health){
      localStorage.setItem('character', '')
      this.state = 'lost'
    }
  }

  goAgain() {
    this._reset()
    this._setRemainingChars(this.characters)
    this.character = this._newCharacter(this.characters)
  }

  nextCharacter() {
    this._reset()
    this.remainingChars.splice(this.remainingChars.indexOf(this.character), 1)
    
    this._setRemainingChars(this.remainingChars.length ? this.remainingChars : this.characters)
    this.character = this._newCharacter(this.remainingChars.length ? this.remainingChars : this.characters)
  }

  private _reset() {
    this.health = 4;
    this.state = null;
    this.formComponent.resetForm()
  }
}
