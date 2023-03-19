let currentKey = 0;
const apiKeys = process.env.API_KEYS!.split(",");
console.log("API keys: " + apiKeys.length);

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
