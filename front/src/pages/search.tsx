import React from "react";
import { useParams } from "react-router-dom";
import { SearchResult, SearchResultResponse } from "../types";

export default function Search() {
    const { query } = useParams();
    const [searchResults, setSearchResults] =
        React.useState<SearchResultResponse>();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        fetch(`http://localhost:3000/api/search/?query=${query}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setSearchResults(data);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <ul>
                    {searchResults?.results.map((result: SearchResult) => (
                        <li key={result.id}>
                            <a href={`/recipe/${result.id}`}>{result.title}</a>
                            <img src={result.image} alt={result.title} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
