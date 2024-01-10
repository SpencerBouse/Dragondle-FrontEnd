import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon'; 
import { MatCardModule } from '@angular/material/card';

import { Hint, Character } from '../characters.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule, 
    MatDividerModule, 
    MatIconModule, 
    MatCardModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnChanges {
  @Input() character!: Character;
  @Input() health!: number;
  @Input() state!: string | null;

  currStreak: number = 0;
  maxStreak: number = 0;
  shownHints: Hint[] = [];

  ngOnInit(): void {
    const current = localStorage.getItem('current')
    const max = localStorage.getItem('max')

    if(current){
      this.currStreak = parseInt(current)
    }else {
      this._setLocalStorage('current', String(this.currStreak))
    }

    if(max){
      this.maxStreak = parseInt(max)
    }else {
      this._setLocalStorage('current', String(this.maxStreak))
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['health']?.currentValue === 4) {
      this.resetHints()
    }
    if(changes['health']?.previousValue > changes['health']?.currentValue){
      this.showHint()
    }
    if(changes['state']?.previousValue === null && changes['state']?.currentValue === 'win'){
      this.currStreak++
      this._setLocalStorage('current', String(this.currStreak))
      if(this.currStreak > this.maxStreak){
        this.maxStreak = this.currStreak
        this._setLocalStorage('max', String(this.maxStreak))
      }
    }
    if(changes['state']?.previousValue === null && changes['state']?.currentValue === 'lost'){
      this._setLocalStorage('current', '0')
    }
    if(changes['state']?.previousValue === 'lost' && changes['state']?.currentValue === null){
      this.currStreak = 0
    }
  }

  showHint() {
    if(this.shownHints.length<3) {
      this.shownHints.push(this.character.hints[this.shownHints.length]);
    }
  }
  private resetHints() {
    this.shownHints = [];
  }

  private _setLocalStorage(key: string, value: string){
    localStorage.setItem(key, value)
  }
}
