# **App Name**: Linux User Group

## Core Features:

- Animated Mascot: Interactive 3D model of TUX rendered using `react-three-fiber` with scroll-linked animations. Includes a toggle switch for Terminal View (monochrome green-on-black mode).
- Hero Section: Hero section with project title (Linux User Group), subtitle (BITS Pilani Dubai Campus), and a Call-To-Action button (Get Started) in rich golden mustard `#D29B22`.
- Top Navigation Bar: Top navigation bar with links: Home, About, Council, Events, Profile, Forum. Includes a theme toggle: Light, Dark, Terminal.
- About Page: Static informational content about the organization: Who We Are, Our Mission, What We Do. Features a responsive layout with dynamic theme support.
- Council Page: Dynamic member cards for council roles: President, Vice President, Secretary, Treasurer. Data fetched from Firestore or hardcoded, editable by admins in the Admin Panel.
- Events Calendar: Calendar view with monthly event display. Each event includes: Title, description, external link, start time/date, and recurring support (weekly/monthly w/ repeat count).
- Event Reminder System: Sends email and in-app notifications 1 day and 1 hour before each event.
- Admin Event Control: Admin control to add, edit, and delete events via Admin Panel. Real-time Firestore sync for live frontend updates.
- Real-Time Chat: Real-time chat powered by Firebase Firestore with instant messaging, timestamps, and user display.
- Image Uploads: Image uploads to Firebase Storage with previews (thumbnails) shown in chat.
- Image Tagging (AI): The tool uses Gemini AI to suggest image tags like: `linux`, `python`, `event`. Aids in content discovery and moderation.
- Moderation Tools: Admins can delete chat messages or images.
- Authentication: Google Sign-In restricted to `@dubai.bits-pilani.ac.in` domain. Outside domain access is denied.
- User Dashboard Features: User dashboard features to view personal details (name, email, avatar), choose theme (Light / Dark / Terminal), view event participation history, and download event certificates.
- Certificate Generation: The tool uses Gemini AI to fill in dynamically user full name, event name, and date on the certificate template. PDF generated and auto-saved to user's profile for download.
- Access Control: Restricted access via Firebase Custom Claims. Admins verified using role-based logic.
- Dashboard Functions: Dashboard functions to create/edit/delete events, upload and assign certificate templates, modify user profiles, and moderate chat/forum.

## Style Guidelines:

- `#D29B22` — rich golden mustard (for CTAs and highlights)
- `#0D0D0D` — pitch black dark theme background
- `#D29B22` — for buttons, hover states, toggles, icons
- `Inter` — clean, modern sans-serif
- `Source Code Pro` — monospaced developer font
- Minimalist, line-based (e.g., `lucide-react`, `heroicons`)
- Subtle fade, slide, scale (powered by Framer Motion)
- Fully responsive via Tailwind CSS with Grid/Flexbox
- Light, Dark, Terminal (green text on black background)