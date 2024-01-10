import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

export interface Hint {
  level: string;
  hint: string;
}
export interface Character {
  _id: string;
  name: string;
  image: string;
  hints: Hint[];
}
export interface Response {
  characters: Character[];
}

@Injectable({
  providedIn: 'root'
})
export class CharactersService extends Query<Response> {
  override document = gql`
  query Characters {
    characters {
      _id
      name
      image
      hints {
        level
        hint
      }
    }
  }`
}
