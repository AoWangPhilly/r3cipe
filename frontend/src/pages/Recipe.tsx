import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleType, RecipeType } from "../types";
import {
    Avatar,
    Grid,
    IconButton,
    Rating,
    Typography,
    Box,
    CircularProgress,
    Button,
} from "@mui/material";
import { stripHtml } from "string-strip-html";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../context/AuthContext";
import ShareModal from "../components/ShareModal";
import Send from "@mui/icons-material/Send";

const addFavorite = (id: string) => {
    fetch(`/api/user/inventory/favorite/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    // .then((res) => res.json())
    // .then((data) => {
    //     console.log("add favorite", data);
    // });
};

const removeFavorite = (id: string) => {
    fetch(`/api/user/inventory/favorite/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    // .then((res) => res.json())
    // .then((data) => {
    //     console.log("remove favorite", data);
    // });
};

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuth, userId } = useContext(AuthContext);
    const [recipe, setRecipe] = React.useState<RecipeType>();
    const [owner, setOwner] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [isPublic, setIsPublic] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);
    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [circles, setCircles] = React.useState<CircleType[]>([]);
    const [selectedCircle, setSelectedCircle] = React.useState<string>("");
    const [userRating, setUserRating] = React.useState<number | null>(0);
    const [totalReviews, setTotalReviews] = React.useState<number>(0);

    const handleShareModalOpen = () => {
        setShareModalOpen(true);
    };

    const handleShareModalClose = () => {
        setShareModalOpen(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) {
        }
    }, [isAuth]);
    //mock data

    useEffect(() => {
        if (isAuth) {
            // fetch(`/api/user/inventory/pantry`, {
            //     method: "GET",
            //     credentials: "include",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            // })
            //     .then((res) => res.json())
            //     .then(
            //         (result) => {
            //             console.log("pantry", result);
            //         },
            //         (error) => {
            //             setError(error);
            //         }
            //     );
            fetch(`/api/user/inventory/favorite`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        // console.log("favorites", result);
                        //results is an array of objects with id property
                        //check if id is in array
                        const isFav = result.some(
                            (fav: { recipeId: string }) => fav.recipeId === id
                        );
                        setIsFavorite(isFav);
                    },
                    (error) => {
                        setError(error);
                    }
                );
            fetch(`/api/circles`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    // console.log("circles", result);
                    setCircles(result.socialCircles);
                });
        }
    }, [isAuth]);
    useEffect(() => {
        //fetch recipe from backend
        fetch(`/api/search/recipe/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return Promise.reject("Could not find that recipe");
                }
                return res.json();
            })
            .then(
                (result) => {
                    // console.log(result);
                    setRecipe(result.recipe.recipe);
                    setOwner(result.recipe.userId);
                    setIsPublic(result.recipe.isPublic);
                    setIsLoaded(true);
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                }
            );
    }, [id]);

    // get reviews and ratings info from backend
    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews/recipe/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Could not fetch reviews");
            }

            const data = await res.json();
            console.log("reviews", data);
            setTotalReviews(data.totalReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        //fetchReviews();
    }, [id]);

    function onRecipeRatingChange(
        event: React.SyntheticEvent<Element, Event>,
        value: number | null
    ) {
        setUserRating(value);
        console.log(value);
        // Send user's rating to backend
        // Update overall recipe's rating in backend
        // retrieve new backend rating and update state of userRating and totalReviews to show new rating
    }

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <CircularProgress />;
    } else {
        return (
            <>
                {recipe && (
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            margin: "auto",
                            width: "80%",
                            marginTop: "2rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <Grid item xs={12}>
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                {recipe.title}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "auto",
                            }}
                        >
                            {/* Rating for recipe */}
                            {isAuth && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        component="span"
                                    >
                                        Ratings:
                                    </Typography>
                                    <Rating
                                        name="half-rating"
                                        defaultValue={0}
                                        precision={0.5}
                                        value={userRating}
                                        onChange={onRecipeRatingChange}
                                        sx={{ ml: 1 }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        component="span"
                                        sx={{ ml: 2 }}
                                    >
                                        ({totalReviews})
                                    </Typography>
                                </Box>
                            )}
                            {owner === userId && (
                                <Button
                                    variant="contained"
                                    color="info"
                                    sx={{
                                        marginLeft: "1rem",
                                        color: "white",
                                    }}
                                    onClick={() => navigate(`/edit/${id}`)}
                                    endIcon={
                                        <BorderColorIcon
                                            style={{ color: "white" }}
                                        />
                                    }
                                >
                                    Edit
                                </Button>
                            )}
                            {isAuth ? (
                                <>
                                    {isFavorite ? (
                                        <Button
                                            sx={{
                                                color: "white",
                                            }}
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                removeFavorite(id!);
                                                setIsFavorite(false);
                                            }}
                                            endIcon={
                                                <FavoriteIcon
                                                    style={{
                                                        color: "white",
                                                    }}
                                                />
                                            }
                                        >
                                            Unfavorite
                                        </Button>
                                    ) : (
                                        <Button
                                            sx={{
                                                color: "red",
                                            }}
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                addFavorite(id!);
                                                setIsFavorite(true);
                                                setIsClicked(true);
                                                setTimeout(() => {
                                                    setIsClicked(false);
                                                }, 300);
                                            }}
                                            className={isClicked ? "pop" : ""}
                                            endIcon={
                                                <FavoriteBorderIcon
                                                    style={{ color: "red" }}
                                                />
                                            }
                                        >
                                            Favorite
                                        </Button>
                                    )}
                                    {isPublic ? (
                                        <Button
                                            onClick={() => {
                                                setShareModalOpen(true);
                                            }}
                                            sx={{
                                                color: "white",
                                            }}
                                            variant="contained"
                                            endIcon={
                                                <SendIcon
                                                    style={{
                                                        color: "white",
                                                    }}
                                                />
                                            }
                                        >
                                            Share to Circle
                                        </Button>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Avatar
                                alt={recipe.title}
                                src={recipe.image}
                                variant="square"
                                style={{
                                    width: "60%",
                                    height: "100%",
                                    margin: "auto",
                                }}
                                children={<RestaurantIcon />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {recipe.preparationMinutes > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Prep Time: </b>
                                    {recipe.preparationMinutes} minutes
                                </Typography>
                            )}
                            {recipe.cookingMinutes > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Cook Time: </b>
                                    {recipe.cookingMinutes} minutes
                                </Typography>
                            )}
                            <Typography variant="subtitle1">
                                <b>Servings: </b>
                                {recipe.servings}
                            </Typography>
                            {recipe.cuisines.length > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Cuisines: </b>
                                    {recipe.cuisines.join(", ")}
                                </Typography>
                            )}
                            {recipe.dishTypes.length > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Dish Type: </b>
                                    {recipe.dishTypes.join(", ")}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant="body1"
                                align="justify"
                                gutterBottom
                            >
                                {stripHtml(recipe.summary).result}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Ingredients:
                            </Typography>
                            <ul>
                                {recipe.extendedIngredients.map(
                                    (ingredient) => (
                                        <li key={ingredient.id}>
                                            {ingredient.original}
                                        </li>
                                    )
                                )}
                            </ul>
                        </Grid>
                        {recipe.instructions && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Instructions:
                                </Typography>
                                <ol>
                                    {recipe.instructions
                                        //split by ". " or "\n"
                                        .split(/\. |\n/)
                                        .filter((step) => step !== "")
                                        .map((step) => (
                                            <li key={step}>{step}</li>
                                        ))}
                                </ol>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            {recipe.sourceUrl && (
                                <Typography variant="subtitle1">
                                    Source URL:{" "}
                                    <a
                                        href={recipe.sourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {recipe.sourceUrl}
                                    </a>
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                )}
                <ShareModal
                    shareModalOpen={shareModalOpen}
                    handleShareModalClose={handleShareModalClose}
                    recipeId={id!}
                    circles={circles}
                    selectedCircle={selectedCircle}
                    setSelectedCircle={setSelectedCircle}
                    recipeImage={recipe!.image}
                    recipeTitle={recipe!.title}
                />
            </>
        );
    }
};

export default Recipe;
