# Onboarding implementation notes

- Cookie choice is stored locally and in a SameSite=Lax cookie.
- Interest and discovery-source answers are stored locally in the visitor browser.
- No onboarding response is submitted to a server by this static implementation.
- Returning visitors who enabled music will resume it on their next user gesture, respecting browser autoplay restrictions.
