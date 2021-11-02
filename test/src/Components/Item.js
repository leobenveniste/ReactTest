import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

export default function Item (props) {
    let history = useHistory();
    const itemName = props.match?.params.id;

    const GET_ITEMS = gql`
        query GetItem ($name: String!) {
            pokemon(name: $name) {
                id
                name
                weight
                height
                types {
                    type {
                        name
                    }
                }
                abilities {
                    ability {
                        name
                    }
                }
                game_indices {
                    version {
                        name
                    }
                }
            }
        }    
    `
    const { loading, error, data } = useQuery(GET_ITEMS, {variables: { name: itemName }});

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Error :(</p>
            </div>
        );
    }
    
    const home = () => {
        const url = '/list/' + props.page;
        history.push(url);
    }
    
    const cap = (text) => {
        return text[0].toUpperCase() + text.slice(1, text.length);
    }
    
    if (data) {
        document.title = cap(data.pokemon.name);
    }

    return (
        <div className="flex flex-col items-stretch relative " style={{height: '100%'}}>
            <div className="itemBkg absolute z-0" style={{backgroundImage: 'url(' + data?.character?.imageUrl?.split('/revision')[0] + ')'}}></div>
            <div className="flex flex-col items-stretch md:p-2 z-10 overflow-hidden" style={{height: '100%'}}>
                <header className="flex flex-row">
                    <button onClick={() => home()} className="button flex flex-row items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M 13 5.9296875 L 6.9296875 12 L 13 18.070312 L 14.5 16.570312 L 9.9296875 12 L 14.5 7.4296875 L 13 5.9296875 z"></path>
                        </svg>
                        <span className="pl">Go back</span>
                    </button>
                </header>
                <div className="flex-1 flex flex-row items-center overflow-auto" style={{height: 'calc(100% - 40px)'}}>
                    {loading && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                    )}
                    {!loading && data?.pokemon && (
                        <div className="flex-1 flex flex-col md:flex-row items-center md:justify-center md:overflow-hidden" style={{height: '100%'}}>
                            <h1 className="block md:hidden mb-6 text-6xl">{cap(data.pokemon.name)}</h1>
                            <div className="flex flex-row items-center justify-center md:mr-10">
                                <div className="flex-1 pokedexContainer flex flex-row items-center justify-center">
                                    <img className="pokedex" src={process.env.PUBLIC_URL + '/images/pokedex.png'} alt={cap(data.pokemon.name)} title={cap(data.pokemon.name)}/>
                                    <img className="pokemon" src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + data.pokemon.id + '.png'} alt={cap(data.pokemon.name)} title={cap(data.pokemon.name)}/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2 md:overflow-hidden mt-2 md:mt-0">
                                <div className="flex flex-col gap-y-3">
                                    <h1 className="hidden md:flex">{cap(data.pokemon.name)}</h1>
                                    <div className="flex flex-row items-center gap-x-3 p-1">
                                        <span>Types</span>
                                        {data.pokemon.types.map((i) => (
                                            <img key={i.type.name} src={process.env.PUBLIC_URL + '/images/' + i.type.name + '.png'} title={cap(i.type.name)} alt={cap(i.type.name)} style={{width: '3em'}} />
                                        ))}
                                    </div>
                                    <div className="flex flex-row gap-8">
                                        <div className="flex flex-col p-1">
                                            <span className="mb-1">Weight</span>
                                            <h2>{data.pokemon.weight / 10} kg</h2>
                                        </div>
                                        <div className="flex flex-col p-1">
                                            <span className="mb-1">Height</span>
                                            <h2>{data.pokemon.height /10} m</h2>
                                        </div>
                                        <div className="flex flex-col p-1">
                                            <span className="mb-1">Abilities</span>
                                            {data.pokemon.abilities.map((i) => <h2 key={i.ability.name}>{cap(i.ability.name)}</h2>)}
                                        </div>
                                    </div>
                                </div>
                                {data.pokemon.game_indices.length > 0 && (
                                    <div className="flex flex-col overflow-auto p-2" style={{maxHeight: '100%'}}>
                                        <span className="mb-3">Appears in</span>
                                        <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-2 gap-x-6">
                                            {data.pokemon.game_indices.map((i) => <h2 key={i.version.name}>{cap(i.version.name)}</h2>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}