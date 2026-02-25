# WanderAI — API Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-02-25  
> **Base URL:** `https://api.wanderai.com` *(replace with actual backend URL)*  
> **Frontend Mock File:** `src/services/api.js` → replace mock implementations with real `fetch`/`axios` calls

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [1. Get User Location](#1-get-user-location)
   - [2. Get Places](#2-get-places)
   - [3. Get Place by ID](#3-get-place-by-id)
   - [4. Get Trending Places](#4-get-trending-places)
   - [5. Get Crowd Timeline](#5-get-crowd-timeline)
   - [6. Get Nearby (Food & Stay)](#6-get-nearby-food--stay)
   - [7. Get Teams](#7-get-teams)
   - [8. Get Similar Places](#8-get-similar-places)
   - [9. Get User Profile](#9-get-user-profile)
   - [10. Get User History](#10-get-user-history)
   - [11. Get Recommendations](#11-get-recommendations)
   - [12. Get Similar Users' Places](#12-get-similar-users-places)
   - [13. Send Chat Message](#13-send-chat-message)
   - [14. Generate Itinerary](#14-generate-itinerary)
4. [Page → API Mapping](#page--api-mapping)
5. [Enums & Constants](#enums--constants)
6. [Error Handling](#error-handling)

---

## Overview

The WanderAI frontend requires **14 API endpoints** to power the full application. These are currently mocked in `src/services/api.js` using static data from `src/mock/places.json`.

| Category               | Endpoints | Description                                      |
|------------------------|-----------|--------------------------------------------------|
| Location & Places      | 8         | Place discovery, details, crowd data, nearby info |
| User & Personalization | 4         | Profile, history, AI recommendations              |
| AI Chat & Itinerary    | 2         | Conversational AI assistant, itinerary generation  |

---

## Authentication

> **Note:** Authentication is not yet implemented. When added, the following headers should be sent with protected endpoints (User & Personalization APIs):

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Public endpoints** (no auth required): APIs 1–8, 13  
**Protected endpoints** (auth required): APIs 9–12, 14

---

## API Endpoints

---

### 1. Get User Location

Detects or returns the user's current city and state. Used by the Navbar component to display the location chip.

| Property    | Value                    |
|-------------|--------------------------|
| **Method**  | `GET`                   |
| **URL**     | `/api/location`         |
| **Auth**    | Not required            |
| **Used By** | `Navbar`                |
| **Frontend Function** | `getUserLocation()` |

#### Request

No query parameters required. Location can be auto-detected via IP or GPS.

#### Response — `200 OK`

```json
{
  "city": "Pune",
  "state": "MH"
}
```

#### Response Fields

| Field   | Type   | Description                                   |
|---------|--------|-----------------------------------------------|
| `city`  | string | User's detected city name                     |
| `state` | string | Two-letter state abbreviation (e.g., `"MH"`)  |

---

### 2. Get Places

Fetches a list of places near the user's location. Supports filtering by category and sorting. Used on the HomePage ("Popular Near Pune" section) and ListPage (full browse view).

| Property    | Value                                         |
|-------------|-----------------------------------------------|
| **Method**  | `GET`                                         |
| **URL**     | `/api/places`                                 |
| **Auth**    | Not required                                  |
| **Used By** | `HomePage`, `ListPage`                        |
| **Frontend Function** | `getPlaces({ category, sortBy })` |

#### Query Parameters

| Parameter  | Type   | Required | Default      | Description                                           |
|------------|--------|----------|--------------|-------------------------------------------------------|
| `category` | string | No       | `"All"`      | Filter by category. Values: `All`, `Trekking`, `Beaches`, `Temples`, `Mountains`, `Waterfalls`, `Trending` |
| `sortBy`   | string | No       | `"distance"` | Sort order. Values: `distance`, `score`, `crowd`      |

#### Response — `200 OK`

```json
[
  {
    "id": "rajmachi",
    "name": "Rajmachi Trek",
    "emoji": "🥾",
    "bg": "forest",
    "category": "Trekking",
    "tags": ["Trekking", "Nature", "Beginner-Friendly"],
    "crowd_level": "low",
    "experience_score": 91,
    "distance_km": 60,
    "drive_time": "1.5h",
    "price_label": "₹500"
  },
  {
    "id": "sinhagad",
    "name": "Sinhagad Fort",
    "emoji": "⛰️",
    "bg": "mtn",
    "category": "Mountains",
    "tags": ["Fort", "History", "Trek"],
    "crowd_level": "med",
    "experience_score": 78,
    "distance_km": 30,
    "drive_time": "45 min",
    "price_label": "Free"
  }
]
```

#### Response Fields (per place)

| Field              | Type     | Description                                               |
|--------------------|----------|-----------------------------------------------------------|
| `id`               | string   | Unique place identifier, used in URL routing              |
| `name`             | string   | Display name of the place                                 |
| `emoji`            | string   | Emoji icon representing the place                         |
| `bg`               | string   | Background gradient key. See [Enums](#enums--constants)   |
| `category`         | string   | Primary category                                          |
| `tags`             | string[] | Array of tag labels (displayed as chips)                  |
| `crowd_level`      | string   | Current crowd status: `"low"`, `"med"`, `"high"`          |
| `experience_score` | number   | AI-computed experience score (0–100)                      |
| `distance_km`      | number   | Distance from user's location in kilometers               |
| `drive_time`       | string   | Estimated drive time as a human-readable string           |
| `price_label`      | string   | Estimated cost label (e.g., `"₹500"`, `"Free"`)          |

---

### 3. Get Place by ID

Fetches the complete details of a single place. This is the most data-rich endpoint, returning everything needed for the DetailPage including scores, crowd timeline, nearby places, teams, similar places, and AI-generated itinerary.

| Property    | Value                          |
|-------------|--------------------------------|
| **Method**  | `GET`                         |
| **URL**     | `/api/places/:id`             |
| **Auth**    | Not required                  |
| **Used By** | `DetailPage`                  |
| **Frontend Function** | `getPlaceById(id)` |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID (e.g., `"rajmachi"`) |

#### Response — `200 OK`

```json
{
  "id": "rajmachi",
  "name": "Rajmachi Trek",
  "emoji": "🥾",
  "bg": "forest",
  "category": "Trekking",
  "tags": ["Trekking", "Nature", "Beginner-Friendly"],
  "crowd_level": "low",
  "experience_score": 91,
  "distance_km": 60,
  "drive_time": "1.5h",
  "price_label": "₹500",
  "ai_description": "Rajmachi is one of the most rewarding weekend treks near Pune — a hidden gem that rewards early risers with sweeping views of the Sahyadri range...",
  "scores": {
    "popularity": 78,
    "weather_bonus": 92,
    "crowd_penalty": 12,
    "user_affinity": 85
  },
  "crowd_timeline": {
    "hours": [
      { "time": "6A", "value": 10, "is_best_window": false },
      { "time": "7A", "value": 8, "is_best_window": true },
      { "time": "8A", "value": 12, "is_best_window": true },
      { "time": "9A", "value": 25, "is_best_window": false },
      { "time": "10A", "value": 40, "is_best_window": false },
      { "time": "11A", "value": 55, "is_best_window": false },
      { "time": "12P", "value": 60, "is_best_window": false },
      { "time": "1P", "value": 45, "is_best_window": false },
      { "time": "2P", "value": 35, "is_best_window": false },
      { "time": "3P", "value": 28, "is_best_window": false },
      { "time": "4P", "value": 20, "is_best_window": false },
      { "time": "5P", "value": 15, "is_best_window": false },
      { "time": "6P", "value": 12, "is_best_window": false },
      { "time": "7P", "value": 10, "is_best_window": false },
      { "time": "8P", "value": 8, "is_best_window": false },
      { "time": "9P", "value": 6, "is_best_window": false }
    ],
    "best_window": "7 AM – 9 AM"
  },
  "nearby": [
    { "type": "food", "emoji": "🍽️", "name": "Rajmachi Homestay", "distance_label": "0.2 km" },
    { "type": "food", "emoji": "🍵", "name": "Village Tea Stall", "distance_label": "0.5 km" },
    { "type": "hotel", "emoji": "🏡", "name": "Aayush Homestay", "distance_label": "1 km" },
    { "type": "hotel", "emoji": "⛺", "name": "Forest Camp", "distance_label": "2 km" }
  ],
  "teams": [
    {
      "teamId": "t1",
      "name": "Pune Wanderers",
      "memberCount": 5,
      "date": "Sat 5:30 AM",
      "spotsLeft": 2
    },
    {
      "teamId": "t2",
      "name": "Solo Trekkers Club",
      "memberCount": 3,
      "date": "Flexible timing",
      "spotsLeft": 3
    }
  ],
  "similar": [
    { "id": "harishchandragad", "name": "Harishchandragad", "emoji": "🌄", "category": "mtn", "crowd_level": "low" },
    { "id": "visapur", "name": "Visapur Fort", "emoji": "🏰", "category": "forest", "crowd_level": "low" },
    { "id": "bhimashankar", "name": "Bhimashankar", "emoji": "🌳", "category": "forest", "crowd_level": "low" }
  ],
  "itinerary": "🗓️ <b>Rajmachi Day Plan</b><br><br><b>6:30 AM</b> — Depart Pune..."
}
```

#### Response Fields — Detail-specific (additional to place card fields)

| Field                          | Type     | Description                                                       |
|--------------------------------|----------|-------------------------------------------------------------------|
| `ai_description`               | string   | AI-generated description of the place                             |
| `scores.popularity`            | number   | Popularity score (0–100)                                          |
| `scores.weather_bonus`         | number   | Weather favorability score (0–100)                                |
| `scores.crowd_penalty`         | number   | Crowd penalty score (0–100, higher = more crowded)                |
| `scores.user_affinity`         | number   | Personalized affinity score based on user preferences (0–100)     |
| `crowd_timeline.hours`         | array    | Array of hourly crowd data objects                                |
| `crowd_timeline.hours[].time`  | string   | Hour label (e.g., `"6A"`, `"12P"`, `"5P"`)                       |
| `crowd_timeline.hours[].value` | number   | Crowd index value for that hour (0–100)                           |
| `crowd_timeline.hours[].is_best_window` | boolean | Whether this hour falls in the optimal visiting window   |
| `crowd_timeline.best_window`   | string   | Human-readable best time window (e.g., `"7 AM – 9 AM"`)          |
| `nearby`                       | array    | Array of nearby food/hotel spots                                  |
| `nearby[].type`                | string   | Type of nearby spot: `"food"` or `"hotel"`                        |
| `nearby[].emoji`               | string   | Emoji icon for the spot                                           |
| `nearby[].name`                | string   | Name of the nearby place                                          |
| `nearby[].distance_label`      | string   | Distance from the main place (e.g., `"0.5 km"`)                  |
| `teams`                        | array    | Array of open travel groups                                       |
| `teams[].teamId`               | string   | Unique team identifier                                            |
| `teams[].name`                 | string   | Team/group name                                                   |
| `teams[].memberCount`          | number   | Current number of members                                         |
| `teams[].date`                 | string   | Planned trip date/time (e.g., `"Sat 5:30 AM"`)                   |
| `teams[].spotsLeft`            | number   | Number of available spots in the group                            |
| `similar`                      | array    | Array of similar/recommended places                               |
| `similar[].id`                 | string   | Place ID (for navigation)                                         |
| `similar[].name`               | string   | Place name                                                        |
| `similar[].emoji`              | string   | Emoji icon                                                        |
| `similar[].category`           | string   | Category key for gradient background                              |
| `similar[].crowd_level`        | string   | Current crowd level: `"low"`, `"med"`, `"high"`                   |
| `itinerary`                    | string   | HTML-formatted full-day itinerary plan                            |

#### Response — `404 Not Found`

```json
{
  "error": "Place not found",
  "message": "No place exists with the ID 'invalid-id'"
}
```

---

### 4. Get Trending Places

Fetches the list of currently trending places based on search volume, social media mentions, and seasonal patterns. Displayed in the "🔥 Hot Right Now" horizontal scroll section on HomePage.

| Property    | Value                            |
|-------------|----------------------------------|
| **Method**  | `GET`                           |
| **URL**     | `/api/places/trending`          |
| **Auth**    | Not required                    |
| **Used By** | `HomePage`                      |
| **Frontend Function** | `getTrendingPlaces()` |

#### Response — `200 OK`

```json
[
  {
    "id": "rajmachi",
    "name": "Rajmachi Trek",
    "emoji": "🥾",
    "reason_text": "Searches up 140% this week",
    "category": "forest",
    "badge": "🔥 Trending"
  },
  {
    "id": "alibaug",
    "name": "Alibaug Beach",
    "emoji": "🏖️",
    "reason_text": "Hot pick for Feb long weekend",
    "category": "beach",
    "badge": "🔥 Trending"
  },
  {
    "id": "karla",
    "name": "Karla Caves",
    "emoji": "🕌",
    "reason_text": "Trending on Instagram Reels",
    "category": "cave",
    "badge": "📸 Viral"
  }
]
```

#### Response Fields

| Field         | Type   | Description                                           |
|---------------|--------|-------------------------------------------------------|
| `id`          | string | Place ID (for navigation to detail page)              |
| `name`        | string | Display name                                          |
| `emoji`       | string | Emoji icon                                            |
| `reason_text` | string | Why this place is trending (shown on the card)        |
| `category`    | string | Category key for card gradient background             |
| `badge`       | string | Badge label (e.g., `"🔥 Trending"`, `"📸 Viral"`)     |

---

### 5. Get Crowd Timeline

Fetches the hourly crowd data for a specific place for today. Used to render the crowd bar chart on the DetailPage. This can also be obtained from the full place detail response (API #3).

| Property    | Value                                     |
|-------------|-------------------------------------------|
| **Method**  | `GET`                                     |
| **URL**     | `/api/places/:id/crowd-timeline`          |
| **Auth**    | Not required                              |
| **Used By** | `DetailPage` (CrowdChart component)       |
| **Frontend Function** | `getCrowdTimeline(placeId)` |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID             |

#### Response — `200 OK`

```json
{
  "hours": [
    { "time": "6A", "value": 10, "is_best_window": false },
    { "time": "7A", "value": 8, "is_best_window": true },
    { "time": "8A", "value": 12, "is_best_window": true },
    { "time": "9A", "value": 25, "is_best_window": false }
  ],
  "best_window": "7 AM – 9 AM"
}
```

> **Note:** This data is also included in the `getPlaceById` response under `crowd_timeline`. This standalone endpoint is useful for refreshing crowd data without refetching the entire place detail.

---

### 6. Get Nearby (Food & Stay)

Fetches nearby food spots and hotels/stays for a given place. Displayed in the "Nearby Food & Stay" grid on the DetailPage. Also included in the full place detail response (API #3).

| Property    | Value                               |
|-------------|--------------------------------------|
| **Method**  | `GET`                               |
| **URL**     | `/api/places/:id/nearby`            |
| **Auth**    | Not required                        |
| **Used By** | `DetailPage` (NearbyGrid component) |
| **Frontend Function** | `getNearby(placeId)` |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID             |

#### Response — `200 OK`

```json
[
  { "type": "food", "emoji": "🍽️", "name": "Rajmachi Homestay", "distance_label": "0.2 km" },
  { "type": "food", "emoji": "🍵", "name": "Village Tea Stall", "distance_label": "0.5 km" },
  { "type": "hotel", "emoji": "🏡", "name": "Aayush Homestay", "distance_label": "1 km" },
  { "type": "hotel", "emoji": "⛺", "name": "Forest Camp", "distance_label": "2 km" }
]
```

#### Response Fields

| Field            | Type   | Description                                    |
|------------------|--------|------------------------------------------------|
| `type`           | string | `"food"` or `"hotel"`                          |
| `emoji`          | string | Visual icon for the spot                       |
| `name`           | string | Name of the nearby place                       |
| `distance_label` | string | Human-readable distance (e.g., `"0.5 km"`)    |

---

### 7. Get Teams

Fetches open travel groups/teams heading to a specific place. Users can apply to join these groups. Displayed in the "Join a Group · Solo Traveller?" section on the DetailPage. Also included in the full place detail response (API #3).

| Property    | Value                               |
|-------------|--------------------------------------|
| **Method**  | `GET`                               |
| **URL**     | `/api/places/:id/teams`             |
| **Auth**    | Not required                        |
| **Used By** | `DetailPage` (TeamPanel component)  |
| **Frontend Function** | `getTeams(placeId)`  |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID             |

#### Response — `200 OK`

```json
[
  {
    "teamId": "t1",
    "name": "Pune Wanderers",
    "memberCount": 5,
    "date": "Sat 5:30 AM",
    "spotsLeft": 2
  },
  {
    "teamId": "t2",
    "name": "Solo Trekkers Club",
    "memberCount": 3,
    "date": "Flexible timing",
    "spotsLeft": 3
  }
]
```

#### Response Fields

| Field         | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| `teamId`      | string | Unique team identifier                           |
| `name`        | string | Team/group name                                  |
| `memberCount` | number | Current number of members in the group           |
| `date`        | string | Planned trip date/time (human-readable)          |
| `spotsLeft`   | number | Number of available spots remaining              |

---

### 8. Get Similar Places

Fetches places similar to the given place based on category, tags, and user behavior. Displayed in the "You might also like" / similar places section on the DetailPage. Also included in the full place detail response (API #3).

| Property    | Value                                       |
|-------------|----------------------------------------------|
| **Method**  | `GET`                                       |
| **URL**     | `/api/places/:id/similar`                   |
| **Auth**    | Not required                                |
| **Used By** | `DetailPage` (SimilarPlaces component)      |
| **Frontend Function** | `getSimilarPlaces(placeId)` |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID             |

#### Response — `200 OK`

```json
[
  { "id": "harishchandragad", "name": "Harishchandragad", "emoji": "🌄", "category": "mtn", "crowd_level": "low" },
  { "id": "visapur", "name": "Visapur Fort", "emoji": "🏰", "category": "forest", "crowd_level": "low" },
  { "id": "bhimashankar", "name": "Bhimashankar", "emoji": "🌳", "category": "forest", "crowd_level": "low" }
]
```

#### Response Fields

| Field         | Type   | Description                                    |
|---------------|--------|------------------------------------------------|
| `id`          | string | Place ID (for navigation)                      |
| `name`        | string | Place name                                     |
| `emoji`       | string | Emoji icon                                     |
| `category`    | string | Category key (used for gradient backgrounds)   |
| `crowd_level` | string | Current crowd level: `"low"`, `"med"`, `"high"` |

---

### 9. Get User Profile

Fetches the authenticated user's profile including personal details, trip statistics, and travel interests. Used to personalize the HomePage for returning users (WelcomeBackStrip, personalized section headers, and chat context).

| Property    | Value                             |
|-------------|-----------------------------------|
| **Method**  | `GET`                            |
| **URL**     | `/api/user/profile`              |
| **Auth**    | **Required** (Bearer token)      |
| **Used By** | `HomePage` (returning user flow) |
| **Frontend Function** | `getUserProfile()` |

#### Response — `200 OK`

```json
{
  "firstName": "Rohan",
  "tripCount": 3,
  "lastVisit": {
    "placeName": "Rajmachi Trek",
    "date": "Jan 12"
  },
  "interests": ["nature", "trekking", "offbeat spots"]
}
```

#### Response Fields

| Field                  | Type     | Description                                      |
|------------------------|----------|--------------------------------------------------|
| `firstName`            | string   | User's first name                                |
| `tripCount`            | number   | Total number of recorded trips                   |
| `lastVisit.placeName`  | string   | Name of the last visited place                   |
| `lastVisit.date`       | string   | Date of last visit (human-readable)              |
| `interests`            | string[] | Array of user's travel interests/preferences     |

---

### 10. Get User History

Fetches the user's past visit history along with current real-time crowd status for each previously visited place. Used in the "🔄 Visit Again" horizontal scroll section on the HomePage for returning users.

| Property    | Value                             |
|-------------|-----------------------------------|
| **Method**  | `GET`                            |
| **URL**     | `/api/user/history`              |
| **Auth**    | **Required** (Bearer token)      |
| **Used By** | `HomePage` (returning user flow) |
| **Frontend Function** | `getUserHistory()` |

#### Response — `200 OK`

```json
[
  {
    "placeId": "rajmachi",
    "name": "Rajmachi Trek",
    "emoji": "🥾",
    "category": "forest",
    "lastVisited": "Jan 12",
    "current_crowd_label": "Low crowd this weekend",
    "current_crowd_color": "low"
  },
  {
    "placeId": "alibaug",
    "name": "Alibaug Beach",
    "emoji": "🏖️",
    "category": "beach",
    "lastVisited": "Dec 24",
    "current_crowd_label": "Low crowd this Sunday",
    "current_crowd_color": "low"
  },
  {
    "placeId": "tamhini",
    "name": "Tamhini Falls",
    "emoji": "💧",
    "category": "water",
    "lastVisited": "Nov 5",
    "current_crowd_label": "Moderate crowd Sat",
    "current_crowd_color": "med"
  }
]
```

#### Response Fields

| Field                 | Type   | Description                                              |
|-----------------------|--------|----------------------------------------------------------|
| `placeId`             | string | Place ID (for navigation)                                |
| `name`                | string | Place name                                               |
| `emoji`               | string | Emoji icon                                               |
| `category`            | string | Category key for card styling                            |
| `lastVisited`         | string | When the user last visited (human-readable)              |
| `current_crowd_label` | string | Real-time crowd status message for this weekend/period   |
| `current_crowd_color` | string | Crowd color indicator: `"low"`, `"med"`, `"high"`        |

---

### 11. Get Recommendations

Fetches AI-powered personalized place recommendations based on the user's travel interests, past trips, and behavior patterns. Powers the "Based on Your Trips" section on the HomePage for returning users.

| Property    | Value                             |
|-------------|-----------------------------------|
| **Method**  | `GET`                            |
| **URL**     | `/api/user/recommendations`      |
| **Auth**    | **Required** (Bearer token)      |
| **Used By** | `HomePage` (returning user flow) |
| **Frontend Function** | `getRecommendations()` |

#### Response — `200 OK`

Returns an array of place objects (same structure as the [Get Places](#2-get-places) response):

```json
[
  {
    "id": "harishchandragad",
    "name": "Harishchandragad",
    "emoji": "🌄",
    "bg": "mtn",
    "category": "Trekking",
    "tags": ["Trekking", "Nature"],
    "crowd_level": "low",
    "experience_score": 93,
    "distance_km": 130,
    "drive_time": "2.5h",
    "price_label": "₹800"
  },
  {
    "id": "kalsubai",
    "name": "Kalsubai Peak",
    "emoji": "⛰️",
    "bg": "forest",
    "category": "Trekking",
    "tags": ["Trekking", "Nature"],
    "crowd_level": "low",
    "experience_score": 89,
    "distance_km": 165,
    "drive_time": "3h",
    "price_label": "Free"
  }
]
```

> **Note:** Response fields are identical to the [Get Places](#2-get-places) card format. These are rendered using the same `PlaceCard` component.

---

### 12. Get Similar Users' Places

Fetches places visited by users with similar travel profiles using collaborative filtering. This shows what other users with matching interests have enjoyed. Powers the "🧑‍🤝‍🧑 Travellers Like You Also Visited" section on the HomePage.

| Property    | Value                                |
|-------------|---------------------------------------|
| **Method**  | `GET`                                |
| **URL**     | `/api/user/similar-users/places`     |
| **Auth**    | **Required** (Bearer token)          |
| **Used By** | `HomePage` (returning user flow)     |
| **Frontend Function** | `getSimilarUserPlaces()` |

#### Response — `200 OK`

```json
[
  { "placeId": "alibaug", "name": "Alibaug", "emoji": "🏖️" },
  { "placeId": "sinhagad", "name": "Sinhagad", "emoji": "🏰" },
  { "placeId": "karla", "name": "Karla Caves", "emoji": "🕌" },
  { "placeId": "rajmachi", "name": "Dudhiware", "emoji": "🌄" }
]
```

#### Response Fields

| Field     | Type   | Description                         |
|-----------|--------|-------------------------------------|
| `placeId` | string | Place ID (for navigation)           |
| `name`    | string | Place display name                  |
| `emoji`   | string | Emoji icon shown in the chip        |

---

### 13. Send Chat Message

Sends a user message to the WanderAI conversational assistant and receives a contextual reply. The AI processes the message, identifies intent (beach, trek, budget, hotel, food, etc.), and responds with relevant travel recommendations, itinerary tips, or follow-up questions.

| Property    | Value                                    |
|-------------|-------------------------------------------|
| **Method**  | `POST`                                   |
| **URL**     | `/api/chat`                              |
| **Auth**    | Optional (personalized if authenticated) |
| **Used By** | `ChatSidebar` (on every page)            |
| **Frontend Function** | `sendChatMessage({ message })` |

#### Request Body

```json
{
  "message": "Plan a weekend trip for 4 friends, budget ₹3,000 each, love beaches"
}
```

#### Request Fields

| Field     | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `message` | string | Yes      | The user's chat message text       |

#### Response — `200 OK`

```json
{
  "reply": "🏖️ For beaches near Pune: Alibaug (96 km, LOW crowd this weekend, ⭐87), Kashid (120 km), or Diveagar (130 km, very offbeat). Budget ₹1,500–₹2,500/person. Want a full plan?",
  "suggestions": []
}
```

#### Response Fields

| Field         | Type     | Description                                                |
|---------------|----------|------------------------------------------------------------|
| `reply`       | string   | AI-generated reply text (may contain emoji)                |
| `suggestions` | array    | Optional follow-up suggestion buttons (currently unused)   |

#### Keyword Triggers (current mock logic)

The mock currently uses keyword matching. The real backend should use AMD-powered AI inference for more sophisticated responses.

| Trigger Keyword | Response Topic                |
|-----------------|-------------------------------|
| `beach`         | Beach recommendations         |
| `trek`          | Trek recommendations          |
| `budget`        | Budget-friendly options        |
| `crowd`         | Least crowded spots            |
| `group`         | Group-friendly places          |
| `solo`          | Solo trip recommendations      |
| `plan`          | Trip planning prompt           |
| `hotel`         | Hotel/stay recommendations     |
| `food`          | Food spot recommendations      |

---

### 14. Generate Itinerary

Generates or fetches an AI-powered full-day itinerary for a specific place. Returns an HTML-formatted timeline with optimal timings based on real-time crowd data. Triggered when the user clicks "🗓️ Build my full day plan" in the chat sidebar on the DetailPage.

| Property    | Value                                      |
|-------------|---------------------------------------------|
| **Method**  | `GET`                                      |
| **URL**     | `/api/places/:id/itinerary`                |
| **Auth**    | Optional                                   |
| **Used By** | `DetailPage` (via ChatSidebar quick reply) |
| **Frontend Function** | `generateItinerary(placeId)` |

#### URL Parameters

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `id`      | string | Yes      | Place ID             |

#### Response — `200 OK`

```json
{
  "itinerary": "🗓️ <b>Rajmachi Day Plan</b><br><br><b>6:30 AM</b> — Depart Pune (avoid traffic)<br><b>8:00 AM</b> — Arrive trailhead. Crowd: 🟢 Low (index 12)<br><b>8:15 AM</b> — Start trek (~3h, moderate difficulty)<br><b>11:30 AM</b> — Summit! Pack lunch here 🎒<br><b>1:00 PM</b> — Descend. Crowd rises to 🟡 45<br><b>2:30 PM</b> — Village homestay lunch (₹150)<br><b>4:30 PM</b> — Head back. Arrive Pune 6:30 PM<br><br><i>Why 8 AM? Crowd drops from 55 to 12 — you'll have the summit almost to yourself.</i>"
}
```

#### Response Fields

| Field       | Type   | Description                                                          |
|-------------|--------|----------------------------------------------------------------------|
| `itinerary` | string | HTML-formatted itinerary string. Rendered using `dangerouslySetInnerHTML`. Contains `<b>`, `<br>`, and `<i>` tags for formatting. |

> ⚠️ **Security Note:** Since this content is rendered as raw HTML, the backend must sanitize the output to prevent XSS attacks.

---

## Page → API Mapping

This section maps each frontend page to the specific API calls it makes:

### HomePage (`/`)

| User State     | API Calls Made                                                                                     |
|----------------|-----------------------------------------------------------------------------------------------------|
| **New User**   | `getPlaces()`, `getTrendingPlaces()`, `sendChatMessage()` (on chat interaction)                     |
| **Returning**  | `getPlaces()`, `getTrendingPlaces()`, `getUserProfile()`, `getUserHistory()`, `getRecommendations()`, `getSimilarUserPlaces()`, `sendChatMessage()` |

### ListPage (`/list/:category`)

| API Call | Purpose |
|----------|---------|
| `getPlaces({ category, sortBy })` | Fetch filtered and sorted places list |
| `sendChatMessage()` | Chat interaction (on user input) |

### DetailPage (`/place/:id`)

| API Call | Purpose |
|----------|---------|
| `getPlaceById(id)` | Fetch complete place details (includes crowd_timeline, nearby, teams, similar, itinerary) |
| `sendChatMessage()` | Chat interaction (on user input) |
| `generateItinerary(placeId)` | Triggered via "Build my full day plan" quick reply |

### Navbar (all pages)

| API Call | Purpose |
|----------|---------|
| `getUserLocation()` | Detect/display user location *(currently hardcoded)* |

---

## Enums & Constants

### Background Gradients (`bg` field)

| Value     | Gradient  | Used For               |
|-----------|-----------|------------------------|
| `beach`   | Warm sand | Beach destinations     |
| `forest`  | Green     | Treks, nature spots    |
| `temple`  | Gold      | Temples, heritage      |
| `mtn`     | Grey-blue | Mountains, forts       |
| `water`   | Blue      | Waterfalls, lakes      |
| `cave`    | Dark      | Caves, underground     |

### Crowd Levels (`crowd_level` field)

| Value  | Display        | Color   | Description              |
|--------|---------------|---------|--------------------------|
| `low`  | `● LOW CROWD` | Green   | Minimal crowd, ideal     |
| `med`  | `● MED CROWD` | Yellow  | Moderate crowd            |
| `high` | `● HIGH CROWD`| Red     | Heavy crowd, avoid peak  |

### Categories

| Category     | Description                  |
|--------------|------------------------------|
| `All`        | No filter, all places        |
| `Trekking`   | Treks and hikes              |
| `Beaches`    | Coastal and beach spots      |
| `Temples`    | Temples and religious sites  |
| `Mountains`  | Mountain forts and viewpoints|
| `Waterfalls` | Waterfalls and water bodies  |
| `Trending`   | Currently trending places    |

### Sort Options (`sortBy` parameter)

| Value      | Description                        |
|------------|------------------------------------|
| `distance` | Sort by distance from user (default)|
| `score`    | Sort by experience score (high→low)|
| `crowd`    | Sort by crowd level (low→high)     |

---

## Error Handling

All endpoints should return standard error responses:

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error description"
}
```

### HTTP Status Codes

| Code | Meaning              | When                                        |
|------|----------------------|---------------------------------------------|
| 200  | Success              | Request successful                          |
| 400  | Bad Request          | Invalid query parameters or request body    |
| 401  | Unauthorized         | Missing or invalid auth token               |
| 404  | Not Found            | Resource (place, user) not found            |
| 429  | Too Many Requests    | Rate limit exceeded (especially for chat)   |
| 500  | Internal Server Error| Unexpected server error                     |

### Frontend Error Handling

The frontend currently handles errors in the chat context:

```javascript
try {
  const response = await apiSendChat({ message: text.trim() });
  // ... handle success
} catch {
  addMessage(pageId, {
    type: 'bot',
    text: "Something went wrong. Please try again.",
  });
}
```

All API functions should follow a similar try/catch pattern with user-friendly fallback messages.

---

## Integration Notes

1. **Current state:** All APIs are mocked in `src/services/api.js` with simulated delays (100–700ms).
2. **Data source:** Mock data lives in `src/mock/places.json` (1,163 lines).
3. **To integrate real APIs:** Replace each function's mock implementation in `api.js` with actual `fetch` or `axios` calls. The response shapes documented above match the current mock data exactly.
4. **Sub-resource endpoints** (APIs 5–8: crowd-timeline, nearby, teams, similar) are also available as nested fields in the full place detail response (API 3). The standalone endpoints are useful for lazy loading or refreshing specific data without refetching the entire place.
5. **Chat endpoint** should ideally support streaming responses for better UX with AI-generated content.
