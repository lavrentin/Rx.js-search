import React, { useState, useEffect } from "react";
import { from, BehaviorSubject,  } from "rxjs";
import {  filter,  mergeMap,  distinctUntilChanged,  debounceTime} from "rxjs/operators";
import "./Pokemon.css";

const myPokemonName = async name => {
  const { results: myNowPokemon } = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=1000"
  ).then(res => res.json());
  console.log(myNowPokemon);
  return myNowPokemon.filter(pokemon => pokemon.name.includes(name));
};

let searchText = new BehaviorSubject("");
let searchResultText = searchText.pipe(
  filter(val => val.length > 1),
  debounceTime(2000),
  distinctUntilChanged(),
  mergeMap(val => from(myPokemonName(val)))
);

const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe(result => {
      setter(result);
    });

    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

function Pokemon() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useObservable(searchResultText, setResults);

  const handleSearchChange = e => {
    const newValue = e.target.value;
    setSearch(newValue);
    searchText.next(newValue);
  };

  return (
    <div className="App">
      <input
        className='myInput'
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
      />
      {results.map(pokemon => (
          <table>
          <tr>
        <td className='tdColor' key={pokemon.name}>name : {pokemon.name}</td>
        </tr>
        </table>
      ))}
    </div>
  );
}
export default Pokemon;


