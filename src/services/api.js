export default {
    "meeting": {
        // "identity": "v1/identity",
        // "resource": "v1/resource",
        // "booking": "v1/booking",
        // "survey": "v1/survey",
        // "meeting": "v1/meeting",
        // "config": "v1/resource/config",
        // "hub": "hubs/room",
        "meeting_by_user": "v1/meeting/meeting_by_user",
    },
    "user": {
        "all_user": "v1/users",
        "login": "v1/identity/token"
    },
    "lobby": {
        "create_qr_by_meeting": "v1/lobby/init_qr",
        "create_qr": "v1/lobby/init_qr_bonus",
        "create_qr_bonus_meeting": "v1/lobby/init_qr_bonus_meeting",
        "hub": "hubs/meeting"
    },
    "report": {
        "guest_from_to": "v1/lobby/report"
    }
}