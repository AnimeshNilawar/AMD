// API service — connects to backend at localhost:5000

const API_BASE = 'http://localhost:5000';

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

// ─── Location & Places ──────────────────────────────────────

export async function getUserLocation() {
    return apiFetch('/api/location');
}

export async function getPlaces({ category, sortBy } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (sortBy) params.set('sortBy', sortBy);
    const query = params.toString();
    return apiFetch(`/api/places${query ? `?${query}` : ''}`);
}

export async function getPlaceById(id) {
    return apiFetch(`/api/places/${id}`);
}

export async function getTrendingPlaces() {
    return apiFetch('/api/places/trending');
}

export async function getCrowdTimeline(placeId) {
    return apiFetch(`/api/places/${placeId}/crowd-timeline`);
}

export async function getNearby(placeId) {
    return apiFetch(`/api/places/${placeId}/nearby`);
}

export async function getTeams(placeId) {
    return apiFetch(`/api/places/${placeId}/teams`);
}

export async function getSimilarPlaces(placeId) {
    return apiFetch(`/api/places/${placeId}/similar`);
}

// ─── User & Personalization ─────────────────────────────────

export async function getUserProfile() {
    return apiFetch('/api/user/profile');
}

export async function getUserHistory() {
    return apiFetch('/api/user/history');
}

export async function getRecommendations() {
    return apiFetch('/api/user/recommendations');
}

export async function getSimilarUserPlaces() {
    return apiFetch('/api/user/similar-users/places');
}

// ─── AI Chat & Itinerary ────────────────────────────────────

export async function sendChatMessage({ message, sessionId }) {
    const body = { message };
    if (sessionId) body.sessionId = sessionId;
    return apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function generateItinerary(placeId) {
    return apiFetch(`/api/places/${placeId}/itinerary`);
}

// ─── Session Management ─────────────────────────────────────

export async function listSessions() {
    return apiFetch('/api/sessions');
}

export async function updateSessionTitle(sessionId, title) {
    return apiFetch(`/api/sessions/${sessionId}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
}

export async function deleteSession(sessionId) {
    return apiFetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
    });
}
