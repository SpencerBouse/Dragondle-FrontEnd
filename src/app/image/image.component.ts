import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Character } from '../characters.service';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.less'
})
export class ImageComponent implements OnChanges {
  @Input() character!: Character;
  @Input() health!: number;
  @Input() state!: string | null;
  loading: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['state']?.currentValue === 'win'){
      this.health = 0
    }if(changes['state']?.previousValue === 'win'){
      this.health = 4
    }
  }

  onLoad() {
    this.loading = false;
  }
}
