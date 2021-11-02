import React, { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import ListItem from "./ListItem";

const GET_ITEMS = gql`
    query GetItems {
        pokemons (limit: 1000, offset: 0) {
            count
            results {
                id
                name
                image
            }
        }
        types {
            results {
                name
            }
        }
    }
`;

const PAGE_SIZE = 50;

export default function List (props) {
    document.title = 'Pokémon Index';

    let history = useHistory();
    const [visibleItems, setVisibleItems] = useState([]);
    const [query, setQuery] = useState('');
    const { loading, error, data } = useQuery(GET_ITEMS);
    if (props.match) {
        props.setPage(+props.match.params.page);
    }

    
    const move = (forward) => { 
        document.getElementById('listContainer').scrollTop = 0;
        const newPage = props.page + (forward ? 1 : -1);
        const url = '/list/' + (newPage);
        history.push(url);
    }

    let totalPages = 0;
    if (!loading && data) {
        totalPages = Math.floor(data.pokemons.results.length / PAGE_SIZE) + 1;
    }
    
    useMemo(() => {
        if (data) {
            setVisibleItems(data.pokemons.results.slice((props.page - 1) * PAGE_SIZE, (props.page - 1) * PAGE_SIZE + PAGE_SIZE));
        }
    }, [data, props.page])
    
    const searchCharacter = (value) => {
        setQuery(value);
        if (isNaN(value) && value.length > 2) {
            const filteredPokemon = data.pokemons.results.filter(p => p.name.indexOf(value.toLowerCase()) !== -1);
            setVisibleItems(filteredPokemon);
        } else if(!isNaN(value)) {
            const filteredPokemon = data.pokemons.results.filter(p => p.id.toString().indexOf(value) !== -1);
            setVisibleItems(filteredPokemon);
        } else {
            setVisibleItems(data.pokemons.results.slice((props.page - 1) * PAGE_SIZE, (props.page - 1) * PAGE_SIZE + PAGE_SIZE));
        }
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Error :(</p>
            </div>
        );
    }

    const surpriseMe = () => {
        const rndIndex = Math.floor(Math.random() * data.pokemons.results.length);
        const rndName = data.pokemons.results[rndIndex].name;
        history.push('/item/' + rndName);
    }

    return (
        <div className="flex-1 flex flex-col items-stretch overflow-hidden">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row items-center p-4 pb-8">
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Pokémon" onClick={() => history.push('/list/1')} />
                <div className="flex-1"></div>
                <button className="button surprise flex flex-row items-center" onClick={() => surpriseMe()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M 12 2 C 6.83 2 2.5507812 5.96 2.0507812 11 L 9.1796875 11 C 9.5996875 9.84 10.7 9 12 9 C 13.3 9 14.400313 9.84 14.820312 11 L 21.949219 11 C 21.449219 5.96 17.17 2 12 2 z M 12 11 A 1 1 0 0 0 11 12 A 1 1 0 0 0 12 13 A 1 1 0 0 0 13 12 A 1 1 0 0 0 12 11 z M 2.0507812 13 C 2.5507813 18.04 6.83 22 12 22 C 17.17 22 21.449219 18.04 21.949219 13 L 14.820312 13 C 14.400313 14.16 13.3 15 12 15 C 10.7 15 9.5996875 14.16 9.1796875 13 L 2.0507812 13 z"></path>
                    </svg>
                    <span className="pl-2">Surprise me!</span>
                </button>
                <div className="flex-1"></div>
                <div className="flex flex-row items-center mt-4 sm:mt-0 inputContainer">
                    <input value={query} type="text" placeholder="Search pokémon..." onChange={(e) => searchCharacter(e.target.value)} />
                    <button className="iconBtn" onClick={() => searchCharacter('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="white" d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
                        </svg>
                    </button>
                </div>
            </header>
            {/* LIST */}
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            )}
            {!loading && data && (
                <div id="listContainer" className="self-stretch flex flex-wrap sm:grid sm:grid-flow-row-dense gap-y-4 p-4 overflow-auto" style={{gridTemplateColumns: 'repeat(auto-fill, 175px)'}}>
                    {data.pokemons.results.length > 0 && visibleItems.map((item, i) => <ListItem item={item}/>)}
                    {!query && props.page < totalPages - 1 && (
                        <div className="flex flex-col items-center justify-center">
                            <button onClick={() => move(true)} className="iconBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                                    <path fill="white" d="M 10 5.9296875 L 8.5 7.4296875 L 13.070312 12 L 8.5 16.570312 L 10 18.070312 L 16.070312 12 L 10 5.9296875 z"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="flex-1"></div>
            {/* FOOTER */}
            <footer className="flex flex-row items-center justify-center p-3" style={{height: '3em'}}>
                {!query && data && (
                    <React.Fragment>
                        {props.page > 1 && <button className="iconBtn" onClick={() => move(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <path fill="white" d="M 13 5.9296875 L 6.9296875 12 L 13 18.070312 L 14.5 16.570312 L 9.9296875 12 L 14.5 7.4296875 L 13 5.9296875 z"></path>
                            </svg>
                        </button>}
                        <p className="px-2"> {((props.page - 1) * PAGE_SIZE) + 1 } to {(props.page - 1) * PAGE_SIZE + PAGE_SIZE} of {data.pokemons.results.length}</p>
                        {props.page < totalPages - 1 && <button className="iconBtn" onClick={() => move(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <path fill="white" d="M 10 5.9296875 L 8.5 7.4296875 L 13.070312 12 L 8.5 16.570312 L 10 18.070312 L 16.070312 12 L 10 5.9296875 z"></path>
                            </svg>
                        </button>}
                    </React.Fragment>
                )}
                {query && (
                    <React.Fragment>
                        {query.length < 3 && <div>Write more than 3 letters to search for a Pokémon</div>}
                        {query.length >=3 && <div>You encountered {visibleItems.length} Pokémon!!</div>}
                    </React.Fragment>
                )}
            </footer>
        </div>
    )
}