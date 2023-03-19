let currentKey = 0;
const apiKeys = process.env.API_KEYS!.split(",");

export function getApiKey() {
    // console.log("Using API key: " + apiKeys[currentKey]);
    return apiKeys[currentKey];
}

export function checkApiKey(pointsLeft: number) {
    console.log("Points left: " + pointsLeft);
    if (pointsLeft <= 4) {
        console.log("Changing API key");
        currentKey = (currentKey + 1) % apiKeys.length;
    }
}
